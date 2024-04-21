<script lang="ts">
	import { browser } from "$app/environment";
	import { getUser, user } from "$lib/api/firebase";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import FriendCard from "./FriendCard.svelte";

	const getFriends = async () => {
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

		return res.user.friends;
	};

    let emailToAdd = "";
    let open = false;

    const addFriend = () => {
        fetch(`/api/v1/user/${$user!.uid}/friend`, {
            method: "POST",
            headers: {
                auth_token: $user!.uid
            },
            body: JSON.stringify({
                friend_email: emailToAdd 
            })
        })

        open = false;
    }
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-xl">Friends</h1>

	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants({ variant: "fancy" })}>Add a Friend</Dialog.Trigger>

		<Dialog.Content class="w-[90%]">
			<Dialog.Header>
				<Dialog.Title>Add with Email</Dialog.Title>
			</Dialog.Header>

            <Input id="email" autocomplete="off" placeholder="john@appleseed.com" bind:value={emailToAdd}/>

			<Dialog.Footer>
				<Button variant="fancy" on:click={addFriend}>Add</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	{#await getFriends()}
		...
	{:then friends}
		{#each friends as friend}
			<FriendCard {friend} />
		{/each}
	{/await}
</div>
