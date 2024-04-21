<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { getUser, user } from "$lib/api/firebase";
	import Water from "$lib/components/water/Water.svelte";
	import type { User } from "firebase/auth";

	import { pie, scaleOrdinal, schemeDark2, select, arc } from "d3";
	import { Separator } from "$lib/components/ui/separator"
	import { onMount } from "svelte";
	import ArrowIcon from "$lib/components/icons/ArrowIcon.svelte";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import { Card } from "$lib/components/ui/card";

	const getData = async () => {
		if (!browser) return;

		const u: User = await getUser();

		const res = await (
			await fetch(`/api/v1/pool/${$page.params.slug}`, {
				headers: {
					auth_token: u.uid,
				},
			})
		).json();

		if (!res.passed) return;

		res.pool.prog = res.pool.members.reduce((acc: number, cur: any) => acc + cur.paid, 0);

		return res.pool;
	};

	let pool: Pool;
	let pieContainer: HTMLDivElement;

	onMount(async () => {
		pool = await getData();
		if (!$user) return;

		let containerWidth = pieContainer.clientWidth;
		let containerHeight = pieContainer.clientHeight;

		const svg = select(pieContainer)
			.append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.append("g")
			.attr("transform", `translate(${containerWidth / 2},${containerHeight / 2})`);

		const data: { [key: string]: number } = { };
		
		for (const member of pool.members) {
			data[member.user + "_PAID"] = member.paid;
			data[member.user + "_UNPAID"] = member.due - member.paid;
		}

		const colors = scaleOrdinal().domain(Object.keys(data)).range(new Array(16).fill(0).map((_, i) => i%2==0 ? schemeDark2[i/2] : "#333333"));
		const pieChart = pie()
			.sort(null)
			.value(d => d[1])
			.padAngle(.05);
		const data_ready = pieChart(Object.entries(data));

		let radius = containerWidth / 2;

		// The arc generator
		const innerArc = arc()
			.innerRadius(radius * 0.75) // This is the size of the donut hole
			.outerRadius(radius * 0.85)
			.cornerRadius(4);

		//Container for the gradients
		var defs = svg.append("defs");

		//Filter for the outside glow
		var filter = defs.append("filter").attr("id", "glow");
		filter.append("feGaussianBlur").attr("stdDeviation", "5").attr("result", "coloredBlur");
		var feMerge = filter.append("feMerge");
		feMerge.append("feMergeNode").attr("in", "coloredBlur");
		feMerge.append("feMergeNode").attr("in", "SourceGraphic");

		svg
			.selectAll("allSlices")
			.data(data_ready)
			.join("path")
			.attr("d", innerArc)
			.attr("fill", d => colors(d.data[1]))
			.style("opacity", 1)
			.style("filter", "url(#glow)");
		
		for (const i in pool.members) {
            const memberid = pool.members[i].user;

            const mres = await (
                await fetch('/api/v1/user/' + memberid, {
                    headers: {
                        auth_token: $user.uid
                    }
                })
            ).json();

            pool.members[i].user = mres.user
        }
	});
</script>

<div class="h-full flex flex-col gap-2 items-center">
	{#if pool}
		<h1 class="text-3xl text-[color:#B7BABE] font-semibold tracking-tight mt-4">{pool.name}</h1>
		<h2 class="text-xl text-[color:#77787E] font-semibold">Deadline in 0 days</h2>
	{/if}

	<div class="w-[calc(100%-2rem)] relative aspect-square">
		<div class="w-[calc(100%-6.25rem)] absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
			{#if pool}
				<div class="rounded-full p-2">
					<Water waterHeight={pool.prog / pool.target} />
				</div>

				<h1 class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
					{((pool.prog / pool.target) * 100).toFixed(0)}%
				</h1>
			{/if}
		</div>

		<div class="w-full h-full" id="pie-container" bind:this={pieContainer}></div>
	</div>

	{#if pool}
		<div class="w-[75%] flex flex-col gap-2 items-center">
			<h2 class="text-3xl text-[color:#B7BABE]">${pool.prog}</h2>
			<Separator/>
			<h2 class="text-3xl text-[color:#77787E]">${pool.target}</h2>
		</div>
		<ScrollArea class="h-[160px] w-3/4">
			{#each pool.members as member}
			<Card class="flex align-middle items-center h-20 touch-none select-none bg-foreground/5">
				<div class="mx-2 h-[80%] aspect-square">
					<Water waterHeight={member.paid / member.due}></Water>
				</div>
				<div>
					<h1 class="text-2xl">{member.user.first_name} {member.user.last_name}</h1>
					<p>${member.paid.toFixed(2)} / ${member.due.toFixed(2)}</p>
				</div>
			</Card>
			{/each}
		</ScrollArea>
	{/if}
</div>
