import type { RequestEvent } from "../$types";
import { store } from "$lib/api/firebase";

import { getDoc, doc, updateDoc } from "firebase/firestore";

export async function GET(event: RequestEvent) {
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    const pool = event.locals.pool;

    if(!auth_token || auth_token != pool.manager) return new Response(JSON.stringify({passed: false, error: "Unauthorized Request"}), { status: 400 });
    
    const { users } = await event.request.json();

    if(!users) return new Response(JSON.stringify({passed: false, error: "Malformed body"}), { status: 400 });

    let users_final = [];
    for(const user of users){

        if(pool.members.includes(user)) continue;
        const user_doc = await getDoc(doc(store, `users/${user}`));

        if(!user_doc.exists) return new Response(JSON.stringify({passed: false, error: "User not found"}), { status: 404 });
        users_final.push(user);
    }


    await updateDoc(doc(store, `pools/${pool.id}`), {
        members: [...pool.members, ...users_final]
    })
}