<script lang="ts">
	import Water from "$lib/components/water/Water.svelte";
	import CardContent from "$lib/components/ui/card/card-content.svelte";
	import CardDescription from "$lib/components/ui/card/card-description.svelte";
	import CardFooter from "$lib/components/ui/card/card-footer.svelte";
	import CardHeader from "$lib/components/ui/card/card-header.svelte";
	import CardTitle from "$lib/components/ui/card/card-title.svelte";
	import Card from "$lib/components/ui/card/card.svelte";
	import { onMount } from "svelte";
    import { goto } from "$app/navigation"
    import { app, auth, poolsRef, store, user, usersRef, getUser } from "$lib/api/firebase"
    import { collection, getDoc, setDoc, addDoc, updateDoc, getDocs, QueryDocumentSnapshot, where, query, doc } from 'firebase/firestore';
	import type { User } from "firebase/auth";
	import { browser } from "$app/environment";

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

        for (const pool of res.pools) {
            pool.prog = pool.members.reduce((acc: number, cur: any) => acc + cur.paid, 0);
        }
        
        return res.pools;
	};

	console.log($user);
</script>

{#await getData()}
	...
{:then data}
    {#if data}
        {#each data as pool}
            <a href={`home/${pool.id}`}>
                <Card class="flex justify-between h-28 touch-none select-none">
                    <CardHeader class="w-1/2">
                        <CardTitle>{pool.name || "Unkown"}</CardTitle>
                        <CardDescription>Progress: ${pool.prog} / ${pool.target || "Unkown"}</CardDescription>
                    </CardHeader>
                    <CardContent class="p-0 h-4/5 max-w-full aspect-square mr-4 self-center">
                        <Water></Water>
                    </CardContent>
                </Card>
            </a>
        {/each}
    {:else}
        Error fetching data!
    {/if}
{/await}
