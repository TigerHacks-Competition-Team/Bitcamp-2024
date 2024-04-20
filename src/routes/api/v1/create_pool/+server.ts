import type { RequestEvent } from "../$types";

const stringify = JSON.stringify;

import { store } from "$lib/api/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

let rand_uuid = (Math.random() + 1).toString(36).substring(2);
function validate(req: any, expected_keys: any) {
	for (const key in expected_keys) {
		if (key in req && typeof req[key] !== expected_keys[key]) return false;
	}
	return true;
}

export async function POST(event: RequestEvent) {
	const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

    if(!auth_token) return new Response(stringify({ passed: false, error: "No auth token provided" }), { status: 400 });

	if (
		!validate(req, {
			name: "string",
			members: "array",

			target: "number",
			deadline: "number",
			merchant: "string",
		})
	)
		return new Response(stringify({ passed: false, error: "Malformed body" }), { status: 400 });

	const { name, members, target, deadline, merchant } = req;

	let quant = 0;
	for (const member of members) {
		if (
			!validate(member, {
				user_id: "string",
				due: "number",
			})
		)
			return new Response(stringify({ passed: false, error: "Malformed body" }), { status: 400 });

		quant += member.due;
		member.paid = 0;
	}

	if (quant != target)
		return new Response(stringify({ passed: false, error: "Dues don't match total" }), { status: 400 });

	const merchant_doc = await getDoc(doc(store, `merchants/${merchant}`));

	if (!merchant_doc.exists)
		return new Response(stringify({ passed: false, error: "Merchant not found" }), { status: 404 });

	await setDoc(doc(store, `pools/${rand_uuid}`), {
		name,
		members,
		target,
		deadline,
		merchant,
		manager: auth_token,
	});

	return new Response(stringify({ passed: true }), { status: 200 });
}
