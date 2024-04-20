import type { RequestEvent } from "../../$types";


export async function GET(event: RequestEvent) {
    const auth_token = event.request.headers.get("auth_token");

    // @ts-ignore
    const pool = event.locals.pool;

    if(!auth_token) return new Response(JSON.stringify({passed: false, error: "No auth token provided"}), { status: 400 });

    return new Response(JSON.stringify({passed: true, pool}), { status: 200 });
}