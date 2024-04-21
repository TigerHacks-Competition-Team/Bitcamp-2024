import type { RequestEvent } from "../../$types";
import { poolsRef, store } from "$lib/api/firebase";

import { getDoc, doc } from "firebase/firestore";

export async function GET(event: RequestEvent) {
    // @ts-ignore
    const user = event.locals.user;
    return new Response(JSON.stringify({ passed: true, user }), { status: 200 });
}