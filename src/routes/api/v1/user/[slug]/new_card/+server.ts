import { doc, updateDoc } from "firebase/firestore";
import { store } from "$lib/api/firebase";

export async function POST(event: RequestEvent) { 
    const auth_token = event.request.headers.get("auth_token");

    if(!auth_token) return new Response(JSON.stringify({passed: false, error: "No auth token provided"}), { status: 400 });

    const nessie_api = import.meta.env.VITE_FB_NESSIE_API;

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
            account_number: "1234567890123456"
        }),
    })).json()).createdObject._id;

    await updateDoc(doc(store, `users/${user.id}`), { 
        cards: [...user.cards, account_id]
     });
    return new Response(JSON.stringify({passed: true, account_id}), { status: 200 });
}