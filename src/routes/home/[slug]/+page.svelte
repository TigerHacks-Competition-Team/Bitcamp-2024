<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { getUser, user } from "$lib/api/firebase";
	import Water from "$lib/components/water/Water.svelte";
	import type { User } from "firebase/auth";

	import { pie, scaleOrdinal, schemeDark2, select, arc } from "d3";
	import { Separator } from "$lib/components/ui/separator";
	import { onMount } from "svelte";
	import ArrowIcon from "$lib/components/icons/ArrowIcon.svelte";
	import * as Command from "$lib/components/ui/command/index.js";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import * as Select from "$lib/components/ui/select";
	import { Card } from "$lib/components/ui/card";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import type { FocusTarget } from "bits-ui";
	import { goto } from "$app/navigation";
	import { toast } from "svelte-sonner";

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
	let addPoolAmount: number = 0;
	let addPoolCardId: string = "";
	let cards: any = {};
	let pieContainer: HTMLDivElement;
	let transactionPending = false;

	const addToPool = async () => {
		if (!$user) return;
		transactionPending = true;

		const res = await (
			await fetch(`/api/v1/pool/${$page.params.slug}/contribute`, {
				method: "POST",
				headers: {
					auth_token: $user.uid,
				},
				body: JSON.stringify({
					account_id: addPoolCardId,
					amount: addPoolAmount,
				}),
			})
		).json();

		console.log(res);

		goto("/").then(() => goto(`/home/${$page.params.slug}`));
	};

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

		const data: { [key: string]: number } = {};

		let totalContributions = 0;
		for (const member of pool.members) {
			data[member.user_id + "_PAID"] = member.paid;
			totalContributions += member.paid;
		}

		data["UNPAID"] = pool.target - totalContributions;
		let schemeDark2Darkend = [...schemeDark2];
		schemeDark2Darkend.sort(() => Math.random() - 0.5);
		schemeDark2Darkend[pool.members.length] = "#333333";

		//const colors = scaleOrdinal().domain(Object.keys(data)).range(schemeDark2Darkend);
		const pieChart = pie()
			.sort(null)
			.value(d => d[1])
			.padAngle(0.05);
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
			.attr("fill", (d, i) => schemeDark2Darkend[i])
			.style("opacity", 1)
			.style("filter", "url(#glow)");

		for (const i in pool.members) {
			const memberid = pool.members[i].user_id;

			const mres = await (
				await fetch("/api/v1/user/" + memberid, {
					headers: {
						auth_token: $user.uid,
					},
				})
			).json();

			pool.members[i].user_id = mres.user;
		}

		cards = (await (await fetch(`/api/v1/user/${$user.uid}/cards`)).json()).cards;

		console.log(cards);
	});

	const drainPool = async () => {
		if (!$user) return;

		await fetch(`/api/v1/pool/${$page.params.slug}/finalize`, {
			method: "POST",
			headers: {
				auth_token: $user!.uid,
			}
		})

		goto("/").then(() => goto(`/home/${$page.params.slug}`));
	}

	const closePool = async () => {
		if (!$user) return;

		await fetch(`/api/v1/pool/${$page.params.slug}`, {
			method: "DELETE",
			headers: {
				auth_token: $user!.uid,
			}
		})

		goto("/").then(() => goto(`/home/`));
	}
</script>

<div class="h-full flex flex-col gap-2 items-center overflow-y-scroll no-scrollbar" style="scrollbar-width:none">
	{#if pool}
		<h1 class="text-3xl text-[color:#B7BABE] mt-4">{pool.name}</h1>
		<h2 class="text-xl text-[color:#77787E]">Deadline in 30 days</h2>
	{/if}

	<div class="w-[calc(100%-2rem)] relative aspect-square">
		<div class="w-[calc(100%-6.25rem)] absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
			{#if pool}
				<div class="rounded-full p-2">
					<Water waterHeight={pool.prog / pool.target} />
				</div>

				<h1 class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-white">
					{((pool.prog / pool.target) * 100).toFixed(0)}%
				</h1>
			{/if}
		</div>

		<div class="w-full h-full" id="pie-container" bind:this={pieContainer}></div>
	</div>

	{#if pool && cards}
		<div class="flex flex-row items-center content-between justify-evenly w-full">
			<Dialog.Root>
				<Dialog.Trigger>
					<Button variant="fancy">
					{pool.prog == pool.target ? "Finalize Pool" : "Add To Pool"}
					</Button>
				</Dialog.Trigger>
				<Dialog.Content class="w-[90%]">
					{#if pool.prog != pool.target}
						<Dialog.Header>
							<Dialog.Title>Add To Pool</Dialog.Title>
						</Dialog.Header>
						<div class="flex flex-col justify-items-center">
							<Input on:input={e => (addPoolAmount = parseFloat(e.target.value))} placeholder="Ammount"></Input>

							<Select.Root
								onSelectedChange={v => {
									addPoolCardId = v.value;
									console.log(addPoolAmount, addPoolCardId);
								}}
							>
								<Select.Trigger class="w-[180px]">
									<Select.Value placeholder="Select Card" />
								</Select.Trigger>
								<Select.Content>
									{#each cards as card}
										<Select.Item value={card._id}>{card.nickname}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<Button variant="fancy" on:click={addToPool} disabled={addPoolAmount == 0 || addPoolCardId == "" || transactionPending}
								>Confirm Payment</Button
							>
						</div>
					{:else}
						<Dialog.Header>
							<Dialog.Title>Finalize Pool</Dialog.Title>
						</Dialog.Header>

						<Button variant="fancy" on:click={drainPool}>Drain Pool</Button>
						<Button variant="fancy" on:click={closePool}>Close Pool</Button>
					{/if}
				</Dialog.Content>
			</Dialog.Root>
			<div class="w-24 flex flex-col gap-2 items-center">
				<h2 class="text-3xl text-[color:#B7BABE]">${pool.prog}</h2>
				<Separator />
				<h2 class="text-3xl text-[color:#77787E]">${pool.target}</h2>
			</div>
		</div>
		<ScrollArea class="h-[160px] w-full px-2 mt-2">
			<div class="flex flex-col w-full">
				{#each pool.members as member}
					<Card class="flex align-middle items-center h-20 touch-none select-none bg-foreground/5 mt-4">
						<div class="mx-2 h-[80%] aspect-square">
							<Water waterHeight={member.paid / member.due}></Water>
						</div>
						<div>
							<h1 class="text-2xl">{member.user_id.first_name} {member.user_id.last_name}</h1>
							<p>${member.paid.toFixed(2)} / ${member.due.toFixed(2)}</p>
						</div>
					</Card>
				{/each}
			</div>
		</ScrollArea>		
	{/if}
</div>
