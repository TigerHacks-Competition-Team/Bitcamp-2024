<script lang="ts">
	import { browser } from "$app/environment";
	import { getUser, user } from "$lib/api/firebase";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Card } from "$lib/components/ui/card";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Select from "$lib/components/ui/select";
	import { Input } from "$lib/components/ui/input";
	import type { User } from "firebase/auth";
	import { toast } from "svelte-sonner";
	import { Separator } from "$lib/components/ui/separator";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

	let currentFriends: { [key: string]: any } = {};
	let total = 0;
	let selectedMerchantId: string | undefined;
	let ju: any;
	let poolName = "";
	$: total = Object.values(currentFriends).reduce((acc, cur) => acc + cur.due, 0);

	const merchants: { [key: string]: string } = {
		"6624d2429683f20dd5189aab": "Olive Garden",
		"6624d27f9683f20dd5189aad": "McDonalds",
		"6624d2a79683f20dd5189ab0": "Doordash",
		"6624d2899683f20dd5189aae": "Landlord",
		"6624d2989683f20dd5189aaf": "Michael",
	};

	const getData = async () => {
		if (!browser) return;

		const u = await getUser();

		const res = await (
			await fetch("/api/v1/user/" + u.uid, {
				headers: {
					auth_token: u.uid,
				},
			})
		).json();

		if (!res.passed) return; //FIXME: Handle error

		ju = res.user;

		ju.due = 0;
		currentFriends[ju.id] = ju;

		for (const i in res.user.friends) {
			const friendid: string = res.user.friends[i];

			const fres = await (
				await fetch("/api/v1/user/" + friendid, {
					headers: {
						auth_token: u.uid,
					},
				})
			).json();

			res.user.friends[i] = fres.user;
			res.user.friends[i].due = 0;
		}

		return res.user;
	};

	const submitForm = async () => {
		if (!$user) return;

		fetch("/api/v1/pool", {
			method: "POST",
			headers: {
				auth_token: $user.uid,
			},
			body: JSON.stringify({
				name: poolName,
				members: Object.values(currentFriends).map(e => ({ user_id: e.id, due: e.due })),
				target: total,
				deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
				merchant: selectedMerchantId,
			}),
		});
	};

	const selectMerchant = (v: any) => {
		selectedMerchantId = v?.value;
	};
</script>

<div
	class="absolute inset-0 -z-30"
	style="background-size: 70px 70px;background-image:linear-gradient(to right, #1E2027 1px, transparent 1px),linear-gradient(to bottom, #1E2027 1px, transparent 1px);"
></div>
<div
	class="absolute inset-0 -z-40"
	style="background: radial-gradient(57.01% 13.63% at 50% 0%, #111E2D 0%, #17181D 100%), #17181D"
></div>
<div
	class="absolute left-6 right-6 h-max pb-[150px] bg-[#1d1d21] border-[#252529] border-2 rounded-md overflow-y-scroll"
>
	<p class="text-primary-foreground mt-6 mb-3 text-center text-lg">Create a Pool</p>

	<div class=" mx-6 flex items-center flex-col h-[calc(100%-100px)] justify-evenly gap-2">
		<!-- <h1 class="text-3xl font-bold m-2">Total <span>${total}</span></h1>    -->
		<Input placeholder="Pool name" bind:value={poolName} />

		<Select.Root onSelectedChange={selectMerchant}>
			<Select.Trigger class="">
				<Select.Value placeholder="Select Merchant" />
			</Select.Trigger>
			<Select.Content>
				{#each Object.keys(merchants) as merchantid}
					<Select.Item value={merchantid}>{merchants[merchantid]}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<Separator class="my-3" />

		<p class="text-md text-centered">Add Friends</p>
		<div>
			<Command.Root class="max-w-[450px] rounded-lg border shadow-md">
				<Command.Input placeholder="Search for friends..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group>
						{#await getData() then juser}
							{#each juser.friends as jfriend}
								<Command.Item
									value="{jfriend.first_name} {jfriend.last_name} {jfriend.id}"
									onSelect={() => (currentFriends[jfriend.id] = jfriend)}
								>
									<span>{jfriend.first_name} {jfriend.last_name}</span>
								</Command.Item>
							{/each}
						{/await}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</div>

		<Card>
			<ScrollArea class="h-40">
				{#each Object.values(currentFriends) as friend}
					<Card class="p-2 m-1">
						<h1>{friend.first_name} {friend.last_name}</h1>
						<Input
							on:input={e => (currentFriends[friend.id].due = parseInt(e?.target?.value))}
							placeholder="Amount Due..."
						/>
					</Card>
				{/each}
			</ScrollArea>
		</Card>

		<Separator />

		<Button
			class="justify-self-end"
			on:click={submitForm}
			disabled={isNaN(total) || selectedMerchantId == undefined || poolName == ""}>Submit</Button
		>
	</div>
</div>
