<script lang="ts">
	import Water from "$lib/components/water/Water.svelte";
	import CardContent from "$lib/components/ui/card/card-content.svelte";
	import CardDescription from "$lib/components/ui/card/card-description.svelte";
	import CardHeader from "$lib/components/ui/card/card-header.svelte";
	import CardTitle from "$lib/components/ui/card/card-title.svelte";
	import Card from "$lib/components/ui/card/card.svelte";
    import { user, getUser } from "$lib/api/firebase"
	import type { User } from "firebase/auth";
	import { browser } from "$app/environment";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
	import { onMount } from "svelte";

    const getData = async () => {
        if (!browser) return;

        const u: User = await getUser();

        const res = await (await fetch("/api/v1/get_pools", {
			headers: {
				auth_token:
					u.uid
            },
		})).json();

        if(!res.passed) return; //FIXME: Handle error

        res.pools = res.pools.filter((e: any) => {
            return e != null;
        })

        for (const pool of res.pools) {
            pool.prog = pool.members.reduce((acc: number, cur: any) => acc + cur.paid, 0);
        }
        
        return res.pools;
	}
</script>

{#await getData()}	
    <Card class="flex justify-between h-28 touch-none select-none bg-foreground/5">
        <CardHeader class="w-1/2">
            <Skeleton class="h-4 w-[120px] my-2 mx-14" />
            <Skeleton class="h-4 w-[170px] my-2 mx-14" />
        </CardHeader>
        <CardContent class="p-0 h-4/5 max-w-full aspect-square mr-4 self-center">
            <Skeleton class="h-12 w-12 rounded-full -mx-52 my-5"/>
        </CardContent>
    </Card>
{:then data}
    {#if data}
        {#if data.length == 0}
            <h1 class="text-center">Theres nothing here...</h1>
            <h2 class="text-center">Click the bright blue button to start a pool!</h2>
        {/if}
        <ScrollArea class="h-[calc(100%-100px)]">
            {#each data as pool}
                <a href={`home/${pool.id}`}>
                    <Card class="flex justify-between h-28 touch-none select-none bg-foreground/5">
                        <CardHeader class="w-1/2">
                            <CardTitle>{pool.name || "Unknown"}</CardTitle>
                            <CardDescription class="text-[color:#B7BABE]">Progress: ${pool.prog} / ${pool.target || "Unkown"}</CardDescription>
                        </CardHeader>
                        <CardContent class="p-0 h-4/5 max-w-full aspect-square mr-4 self-center">
                            <Water waterHeight={pool.prog / pool.target}></Water>
                        </CardContent>
                    </Card>
                </a>
            {/each}
        </ScrollArea>
    {:else}
        Error fetching data!
    {/if}
{/await}
