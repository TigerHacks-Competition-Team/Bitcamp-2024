import type { RequestEvent } from "../../$types";
import { poolsRef, store } from "$lib/api/firebase";

import { getDoc, doc } from "firebase/firestore";

export async function GET(event: RequestEvent) {
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    const user = event.locals.user;

    if (!auth_token) return new Response(JSON.stringify({ passed: false, error: "Unauthorized Request" }), { status: 401 });
    return new Response(JSON.stringify({ passed: true, user }), { status: 200 });
}