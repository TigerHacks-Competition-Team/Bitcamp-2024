<script lang="ts">
	import { browser } from '$app/environment';
	import { getUser, user } from '$lib/api/firebase';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card } from '$lib/components/ui/card';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import type { User } from 'firebase/auth';
	import { toast } from 'svelte-sonner';
	import { Separator } from '$lib/components/ui/separator';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';

	let currentFriends: { [key: string]: any } = {};
	let total = 0;
	let selectedMerchantId: string | undefined;
	let ju: any;
	let poolName = '';
	$: total = Object.values(currentFriends).reduce((acc, cur) => acc + cur.due, 0);

	const merchants: { [key: string]: string } = {
		id: 'name'
	};

	const getData = async () => {
		if (!browser) return;

		const u = await getUser();

		const res = await (
			await fetch('/api/v1/user/' + u.uid, {
				headers: {
					auth_token: u.uid
				}
			})
		).json();

		if (!res.passed) return; //FIXME: Handle error

		ju = res.user;

		for (const i in res.user.friends) {
			const friendid: string = res.user.friends[i];

			const fres = await (
				await fetch('/api/v1/user/' + friendid, {
					headers: {
						auth_token: u.uid
					}
				})
			).json();

			res.user.friends[i] = fres.user;
			res.user.friends[i].due = 0;
		}

		return res.user;
	};

	const submitForm = async () => {
		if (!$user) return;

		fetch('/api/v1/pool', {
			method: 'POST',
			headers: {
				auth_token: $user.uid
			},
			body: JSON.stringify({
				name: poolName,
				members: Object.values(currentFriends).map((e) => ({ user_id: e.id, due: e.due })),
				target: total,
				dealine: Date.now() + 30 * 24 * 60 * 60 * 1000,
				merchant_id: selectedMerchantId
			})
		});
	};

	const selectMerchant = (v: any) => {
		selectedMerchantId = v?.value;
	};
</script>

{#await getData() then juser}
	<div class="flex items-center flex-col h-[calc(100%-100px)] justify-evenly">
        <div>
            <h1 class="text-3xl font-bold m-2">Total <span>${total}</span></h1>   
                <Input placeholder="Pool name..." bind:value={poolName} />

                <Select.Root onSelectedChange={selectMerchant}>
                    <Select.Trigger class="w-[180px]">
                        <Select.Value placeholder="Select Merchant" />
                    </Select.Trigger>
                    <Select.Content>
                        {#each Object.keys(merchants) as merchantid}
                        <Select.Item value={merchantid}>{merchants[merchantid]}</Select.Item>
                        {/each}
                </Select.Content>
            </Select.Root>
        </div>
        
		<Separator />

		<div>
            <div>
                <Command.Root class="max-w-[450px] rounded-lg border shadow-md">
                    <Command.Input placeholder="Search friends..." />
                    <Command.List>
                        <Command.Empty>No results found.</Command.Empty>
					<Command.Group>
                        {#each juser.friends as jfriend}
							<Command.Item
                            value="{jfriend.first_name} {jfriend.last_name} {jfriend.id}"
								onSelect={() => (currentFriends[jfriend.id] = jfriend)}
                                >
								<span>{jfriend.first_name} {jfriend.last_name}</span>
							</Command.Item>
                            {/each}
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
                        on:input={(e) => (currentFriends[friend.id].due = parseInt(e?.target?.value))}
                        placeholder="Amount Due..."
                        />
                    </Card>
                    {/each}
                </ScrollArea>
            </Card>
        </div>

		<Separator />

		<Button
            class="justify-self-end"
			on:click={submitForm}
			disabled={isNaN(total) || selectedMerchantId == undefined || poolName == ''}>Submit</Button
		>
	</div>
{/await}
