import type { RequestEvent } from '@sveltejs/kit';

export async function GET (event: RequestEvent) {
    // @ts-ignore
    const user = event.locals.user;

    let cards = [];

    for(const card of user.cards) {
        cards.push({...(await ( await fetch(`http://api.nessieisreal.com/accounts/${card.id}?key=${import.meta.env.VITE_FB_NESSIE_API}`)).json()), ...card});
    }
    
    return new Response(JSON.stringify({ passed: true, cards }), { status: 200 });
}