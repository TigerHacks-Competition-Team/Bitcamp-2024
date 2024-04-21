import { store } from "$lib/api/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import type { RequestEvent } from "../../../$types";

const stringify = JSON.stringify;

export async function POST(event: RequestEvent) {
    const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

    if (!req || !auth_token)
        return new Response(stringify({ passed: false, error: "Malformed body" }), { status: 400 });

    // @ts-ignore
    const user = event.locals.user;

    const friend = (await getDoc(doc(store, `users/${req.friend_id}`))).data();
    
    if (friend!.friend_requests.includes(user.id) || friend!.friends.includes(user.id))
        return new Response(stringify({ passed: false, error: "Friend request already sent" }), { status: 400 });
    
    friend!.friend_requests.push(user.id);

    await setDoc(doc(store, `users/${req.friend_id}`), friend);

    return new Response(stringify({ passed: true }), { status: 200 });
}