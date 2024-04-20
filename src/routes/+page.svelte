<script lang="ts">
	import Water from "$lib/components/Water.svelte";
	import CardContent from "$lib/components/ui/card/card-content.svelte";
	import CardDescription from "$lib/components/ui/card/card-description.svelte";
	import CardFooter from "$lib/components/ui/card/card-footer.svelte";
	import CardHeader from "$lib/components/ui/card/card-header.svelte";
	import CardTitle from "$lib/components/ui/card/card-title.svelte";
	import Card from "$lib/components/ui/card/card.svelte";
	import { onMount } from "svelte";

	let shake: (amount: number) => void;

    let testPools = [{name: "Dinner", due: "100"}];

    onMount(() => {
        
    })
</script>

{#each testPools as pool}
    <Card class="flex justify-between h-28">
        <CardHeader class="w-1/2">
            <CardTitle>{pool.name}</CardTitle>
            <CardDescription>Ammount Due: {pool.due}</CardDescription>
        </CardHeader>
        <CardContent class="p-0 h-4/5 max-w-full aspect-square mr-4 self-center">
            <Water bind:shake></Water>
        </CardContent>
    </Card>
{/each}