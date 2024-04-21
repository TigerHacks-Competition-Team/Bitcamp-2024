import type { RequestEvent } from "@sveltejs/kit";
import { store, auth } from "$lib/api/firebase";
import { setDoc, doc } from "firebase/firestore";

const stringify = JSON.stringify;

export async function POST (event: RequestEvent) {
    const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    const user = event.locals.user;

    if (!req || !auth_token || auth_token != user.id)
        return new Response(JSON.stringify({ passed: false, error: "Unauthorized Request" }), { status: 403 });

    if(!user.friend_requests.includes(req.friend_id))
        return new Response(JSON.stringify({ passed: false, error: "No friend request found" }), { status: 404 });

    user.friend_requests = user.friend_requests.filter((friend: string) => friend != req.friend_id);
    user.friends.push(req.friend_id);

    await setDoc(doc(store, `users/${user.id}`), user);

    return new Response(stringify({ passed: true }), { status: 200 });
}