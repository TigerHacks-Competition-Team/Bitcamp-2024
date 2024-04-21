import type { RequestEvent } from "@sveltejs/kit";
import { store,usersRef } from "$lib/api/firebase";
import { doc, deleteDoc, updateDoc, query, getDocs, where} from "firebase/firestore";

const stringify = JSON.stringify;

export async function POST(event: RequestEvent) {
    const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

    if(!auth_token) return new Response(stringify({ passed: false, error: "No auth token provided" }), { status: 400 });

    const results = (await getDocs(query(usersRef, where("email", "==", req.email)))).docs;

    if(results.length == 0) return new Response(stringify({ passed: false, error: "No user found" }), { status: 404 });
    return new Response(stringify({ passed: true, id: results[0].id }), { status: 200 });
}