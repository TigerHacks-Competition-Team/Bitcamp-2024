import type { RequestEvent } from "../$types";
import { updateDoc, doc } from "firebase/firestore";
import { store } from "$lib/api/firebase";

export async function POST(event: RequestEvent){
    const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    let pool = event.locals.pool;

    if(!auth_token || auth_token != pool.manager) return new Response(JSON.stringify({passed: false, error: "Unautorized Request"}), { status: 403 });

    if(pool.paid < pool.target) return new Response(JSON.stringify({passed: false, error: "Pool not yet finalized"}), { status: 400 });

    const transfer_data = {
        medium: "balance",
        payee_id: pool.merchant,
        amount: pool.target,
        transaction_date: Date.now(),
        description: `Payment to ${pool.name}`
    }

    const transfer = await(await fetch(`http://api.nessieisreal.com/accounts/${pool.pool_account}/transfers?key=${import.meta.env.VITE_FB_NESSIE_API}`, {
        method: "POST",
        body: JSON.stringify(transfer_data)
    })).json();

    if(!transfer.code)
        return new Response(JSON.stringify({passed: false, error: transfer.message}), { status: 500 });

    pool.paid = 0;

    for(const member of pool.members){
        member.paid = 0;
    }

    await updateDoc(doc(store, `pools/${pool.id}`), {
        paid: pool.paid,
        members: pool.members
    });
}