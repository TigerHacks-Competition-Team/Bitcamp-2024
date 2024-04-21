import { updateDoc, doc } from "firebase/firestore";
import { store } from "$lib/api/firebase";

import type { RequestEvent } from "../$types";

const nessie_key = import.meta.env.VITE_FB_NESSIE_API;
export async function POST(event: RequestEvent) {
    const req = await event.request.json();
    const auth_token = event.request.headers.get("auth_token");

    if(!auth_token) return new Response(JSON.stringify({passed: false, error: "No auth token"}), { status: 401 });

    // @ts-ignore
    let pool = event.locals.pool;

    if(!pool.members.includes(auth_token))
        return new Response(JSON.stringify({passed: false, error: "Not a member of this pool"}), { status: 403 });
    
    let member_instance = pool.members.find((member: any) => member.user_id == auth_token);

    if(member_instance.paid == member_instance.due)
        return new Response(JSON.stringify({passed: false, error: "Already paid dues"}), { status: 403 });

    const true_payment = Math.min(req.amount, member_instance.due - member_instance.paid);


    const account_data = await (await fetch(`http://api.nessieisreal.com/accounts/${req.account_id}`)).json();

    if(account_data.balance < true_payment)
        return new Response(JSON.stringify({passed: false, error: "Not enough funds"}), { status: 403 });

    const pool_account = pool.pool_account;

    const transfer_data = {
        medium: "balance",
        payee_id: pool_account,
        amount: true_payment,
        transaction_date: Date.now(),
        description: `Contribution to ${pool.name}`
    }

    const transfer = await(await fetch(`http://api.nessieisreal.com/accounts/${req.account_id}/transfers?key=${nessie_key}`, {
        method: "POST",
        body: JSON.stringify(transfer_data)
    })).json();

    if(!transfer.code)
        return new Response(JSON.stringify({passed: false, error: transfer.message}), { status: 500 });

    member_instance.paid += true_payment;
    pool.paid += true_payment;

    await updateDoc(doc(store, `pools/${pool.id}`), {
        members: pool.members,
        paid: pool.paid
    });
}