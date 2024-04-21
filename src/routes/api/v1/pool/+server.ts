import type { RequestEvent } from "../$types";

import { auth, store } from "$lib/api/firebase";
import { setDoc, doc, getDoc, updateDoc} from "firebase/firestore";
import { VITE_FB_NESSIE_API } from "$env/static/private";


const stringify = JSON.stringify;

function validate(req: any, expected_keys: any) {
	for (const key in expected_keys) {
		if (key in req && typeof req[key] !== expected_keys[key]) return false;
	}
	return true;
}

export async function POST(event: RequestEvent) {
	const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

	let rand_uuid = (Math.random() + 1).toString(36).substring(2);

    if(!auth_token) return new Response(stringify({ passed: false, error: "No auth token provided" }), { status: 400 });

	if (
		!validate(req, {
			name: "string",
			members: "object",

			target: "number",
			deadline: "number",
			merchant: "string",
		})
	)
		return new Response(stringify({ passed: false, error: "Malformed body" }), { status: 400 });

	const { name, target, deadline, merchant } = req;
    const members: any[] = req.members;

	let quant = 0;
	for (const member of members) {
		if (!validate(member, {user_id: "string",due: "number",})) return new Response(stringify({ passed: false, error: "Malformed body" }), { status: 400 });


		const dc = await getDoc(doc(store, `users/${member.user_id}`));
		const data = dc.data();

		if(!data) return new Response(stringify({ passed: false, error: "User not found" }), { status: 404 });

		updateDoc(doc(store, `users/${member.user_id}`), {
			pools: [...data.pools, rand_uuid]
		});
		quant += member.due;
		member.paid = 0;
	}

    if(!members.includes(auth_token)) members.push(auth_token);

	if (quant != target)
		return new Response(stringify({ passed: false, error: "Dues don't match total" }), { status: 400 });

	const customer_id = (await (await fetch(
		`http://api.nessieisreal.com/customers?key=${VITE_FB_NESSIE_API}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: stringify({
				first_name: name,
				last_name: "Pool",
				address: {
					street_number: "4490",
					street_name: "Rossborough Ln",
					city: "College Park",
					state: "MD",
					zip: "20742",
				},
			}),
		}
	)).json()).objectCreated._id;

	const account_id = (await(await fetch(
		`http://api.nessieisreal.com/customers/${customer_id}/accounts?key=${VITE_FB_NESSIE_API}}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: stringify({
				type: "Checking",
				nickname: "Main Account",
				rewards: 0,
				balance: 500,
			}),
		}
	)).json()).objectCreated._id;

	await setDoc(doc(store, `pools/${rand_uuid}`), {
		name,
		members,
		target,
		deadline,
		merchant,
		manager: auth_token,
        id: rand_uuid,
		pool_account: account_id,
		paid: 0
	});

	return new Response(stringify({ passed: true }), { status: 200 });
}