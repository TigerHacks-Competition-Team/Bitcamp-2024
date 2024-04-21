import type { RequestEvent } from "../../$types";

import { store } from "$lib/api/firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

export async function GET(event: RequestEvent) {
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    const pool = event.locals.pool;

    if(!auth_token) return new Response(JSON.stringify({passed: false, error: "No auth token provided"}), { status: 400 });

    return new Response(JSON.stringify({passed: true, pool}), { status: 200 });
}

export async function DELETE(event: RequestEvent) {
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    const pool = event.locals.pool;

    if(!auth_token) return new Response(JSON.stringify({passed: false, error: "No auth token provided"}), { status: 400 });

    if(auth_token != pool.manager) return new Response(JSON.stringify({passed: false, error: "Unauthorized"}), { status: 403 });


    await deleteDoc(doc(store, `pools/${pool.id}`));
    return new Response(JSON.stringify({passed: true}), { status: 200 });
}

export async function PATCH(event: RequestEvent) {
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    const pool = event.locals.pool;

    if(!auth_token) return new Response(JSON.stringify({passed: false, error: "No auth token provided"}), { status: 400 });

    if(auth_token != pool.manager) return new Response(JSON.stringify({passed: false, error: "Unauthorized"}), { status: 403 });

    const data = await event.request.json();

    await updateDoc(doc(store, `pools/${pool.id}`), data);

    return new Response(JSON.stringify({passed: true, pool}), { status: 200 });
}