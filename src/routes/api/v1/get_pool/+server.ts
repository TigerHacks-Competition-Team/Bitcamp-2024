import type { RequestEvent } from "../$types";

export async function GET(event: RequestEvent) {
    const auth_token = event.request.headers.get("auth_token");

    
}