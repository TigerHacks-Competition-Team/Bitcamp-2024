import { doc, updateDoc } from "firebase/firestore";
import { store } from "$lib/api/firebase";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST(event: RequestEvent) { 
    const nessie_api = import.meta.env.VITE_FB_NESSIE_API;
    const req = await event.request.json();

    // @ts-ignore
    const user = event.locals.user;

    const account_id = (await  (await fetch(`http://api.nessieisreal.com/customers/${user.nessie_customer}/accounts?key=${nessie_api}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: "Credit Card",
            nickname: (Math.random() + 1).toString(36).substring(2),
            rewards: 0,
            balance: 500,
            account_number: req.account_number
        }),
    })).json()).objectCreated._id;

    await updateDoc(doc(store, `users/${user.id}`), { 
        cards: [...user.cards, {id: account_id, expiration: req.expiration, name: req.name}]
    });

    return new Response(JSON.stringify({passed: true, account_id}), { status: 200 });
}