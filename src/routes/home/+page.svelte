<script lang="ts">
	import Water from "$lib/components/water/Water.svelte";
	import CardContent from "$lib/components/ui/card/card-content.svelte";
	import CardDescription from "$lib/components/ui/card/card-description.svelte";
	import CardHeader from "$lib/components/ui/card/card-header.svelte";
	import CardTitle from "$lib/components/ui/card/card-title.svelte";
	import Card from "$lib/components/ui/card/card.svelte";
	import { poolsRef, user, usersRef } from "$lib/api/firebase";
	import { getDoc, doc } from "firebase/firestore";

	const getData = async () => {
		const userSnapshot = await getDoc(doc(usersRef, $user?.uid));
		const pools = userSnapshot?.data()?.pools;
		const outPools = [];

		if (!pools) {
			console.warn("Failed to get user pools!", userSnapshot);
			return;
		}

		for (const pool of pools) {
			const poolSnapshot = await getDoc(doc(poolsRef, pool));
			if (!poolSnapshot.exists) {
				console.warn("Tried to get invalid pool!");
				continue;
			}

			outPools.push(poolSnapshot);
		}

		return outPools;
	};
</script>

{#await getData()}
	...
{:then data}
	{#each data as pool}
		<Card class="flex justify-between h-28">
			<CardHeader class="w-1/2">
				<CardTitle>{JSON.stringify(pool.data().name)}</CardTitle>
				<CardDescription>Amount Due: {pool.due}</CardDescription>
			</CardHeader>
			<CardContent class="p-0 h-4/5 max-w-full aspect-square mr-4 self-center">
				<Water></Water>
			</CardContent>
		</Card>
	{/each}
{/await}
