import { goto } from "$app/navigation";
import { auth } from "$lib/api/firebase";

// @ts-ignore
export async function handle({ event, resolve }) {
    if(event.url.pathname.includes("/auth/") && auth.currentUser != undefined){
        goto("/home");
    }

    return resolve(event);
}