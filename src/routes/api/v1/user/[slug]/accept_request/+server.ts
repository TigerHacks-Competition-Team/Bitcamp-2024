import type { RequestEvent } from "@sveltejs/kit";
import { store, auth } from "$lib/api/firebase";
import { setDoc, doc } from "firebase/firestore";

export async function POST (event: RequestEvent) {
    const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    const user = event.locals.user;

    if (!req || !auth_token || auth_token != user.id)
        return new Response(JSON.stringify({ passed: false, error: "Unauthorized Request" }), { status: 403 });

    if(!user.friend_requests.includes(auth_token))
        return new Response(JSON.stringify({ passed: false, error: "No friend request found" }), { status: 404 });

    user.friend_requests = user.friend_requests.filter((friend: string) => friend != auth_token);
    user.friends.push(auth_token);

    await setDoc(doc(store, `users/${user.id}`), user);
    return new Response(JSON.stringify({ passed: true }), { status: 200 });
}