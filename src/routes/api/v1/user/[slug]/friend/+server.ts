import { store } from "$lib/api/firebase";
import { setDoc, doc } from "firebase/firestore";
import type { RequestEvent } from "../../../$types";

const stringify = JSON.stringify;

export async function POST(event: RequestEvent) {
    const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

    if (!req || !auth_token)
        return new Response(stringify({ passed: false, error: "Malformed body" }), { status: 400 });

    // @ts-ignore
    const user = event.locals.user;

    if (user.friend_requests.includes(req.friend_id) || user.friends.includes(req.friend_id))
        return new Response(stringify({ passed: false, error: "Friend request already sent" }), { status: 400 });
    
    user.friends.push(req.friend_id);
    await setDoc(doc(store, `users/${user.id}`), user);

    return new Response(stringify({ passed: true }), { status: 200 });
}