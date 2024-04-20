import { store, poolsRef } from "$lib/api/firebase";

import { doc, getDoc } from "firebase/firestore";

export async function handle({ event, resolve }) {

    if(event.url.pathname.includes("/v1/pool/") && event.params.slug){
        // @ts-ignore
        event.locals.pool = (await getDoc(doc(poolsRef, event.params.slug))).data();

        // @ts-ignore
        if(event.locals.pool == undefined && !event.request.method == "POST"){
            return new Response(JSON.stringify({passed: false, error: "Couldn't find pool"}), { status: 404 });
        }
    }

    return resolve(event)
}