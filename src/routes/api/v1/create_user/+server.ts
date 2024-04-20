import type { RequestEvent } from "../../../$types";

import { store } from "$lib/api/firebase";
import { setDoc, doc } from "firebase/firestore";

const stringify = JSON.stringify;

export async function POST(event: RequestEvent) {
	const req = await event.request.json();
	const auth_token = event.request.headers.get("auth_token");

	if (!req || auth_token)
		return new Response(stringify({ passed: false, error: "Malformed body" }), { status: 400 });

	// Todo: Validate authorization token

	const nessie_req = {
		first_name: req.first_name,
		last_name: req.last_name,

		address: req.address,
	};

	const customer_creation_response = await fetch(
		`http://api.nessieisreal.com/customers?key=${import.meta.env.VITE_FB_NESSIE_API}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: stringify(nessie_req),
		}
	);

	if (customer_creation_response.status !== 201)
		return new Response(stringify({ passed: false, error: "Failed to create customer" }), {
			status: 500,
		});

	const customer_data = await customer_creation_response.json();

	const account_creation_response = await fetch(
		`http://api.nessieisreal.com/customers/${customer_data.objectCreated._id}/accounts?key=${import.meta.env.VITE_FB_NESSIE_API}`,
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
	);

	const account_data = await account_creation_response.json();
	if (account_creation_response.status !== 201)
		return new Response(stringify({ passed: false, error: "Failed to create account" }), {
			status: 500,
		});

	await setDoc(doc(store, `users/${auth_token}`), {
		...nessie_req,
		friends: [],
		pools: [],

		nessie_customer: customer_data.objectCreated._id,
		nessie_account: account_data.objectCreated._id,

		id: auth_token
	});

	return new Response(stringify({ passed: true }), { status: 200 });
}
