import type { RequestEvent } from "../$types";

import { auth, store } from "$lib/api/firebase";
import { getDoc, doc } from "firebase/firestore";

export async function GET(event: RequestEvent) {
	const auth_token = event.request.headers.get("auth_token");

	if (!auth_token)
		return new Response(JSON.stringify({ passed: false, error: "No auth token provided" }), { status: 400 });

	const user_doc = await getDoc(doc(store, `users/${auth_token}`));

	const data = user_doc.data();

	if (!data) return new Response(JSON.stringify({ passed: false, error: "User not found" }), { status: 404 });

	let pools = [];

	for (const pool of data.pools) {
		const pool_doc = await getDoc(doc(store, `pools/${pool}`));

		pools.push(pool_doc.data());
	}

	return new Response(JSON.stringify({ passed: true, pools: pools }));
}
