<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { getUser } from "$lib/api/firebase";
	import Water from "$lib/components/water/Water.svelte";
	import type { User } from "firebase/auth";

    
    const getData = async () => {
        if (!browser) return;

        const u: User = await getUser();
    
        const res = await (await fetch(`/api/v1/pool/${$page.params.slug}`, {
            headers: {
                auth_token:
                    u.uid
            },
        })).json();
    
        if(!res.passed) return;
        
        res.pool.prog = res.pool.members.reduce((acc: number, cur: any) => acc + cur.paid, 0);

        return res.pool;
    } 

</script>

{#await getData()}
    ...
{:then data}
    <div class="p-12 w-[calc(100%-3rem)] relative aspect-square">
        {#each data.members as member}
            <div class="bg-[conic-gradient(red,blue)] rounded-full absolute w-[calc(100%-6rem)] h-[calc(100%-6rem)] box-border"></div>
        {/each}
        <div class="absolute border-white border-8 rounded-full m-3 w-[calc(100%-7.5rem)] h-[calc(100%-7.5rem)]">
            <Water style="bg-white" waterHeight={data.prog / data.target} />
        </div>
    </div>
{/await}
