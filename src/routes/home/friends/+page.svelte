<script lang="ts">
	import { browser } from "$app/environment";
	import { getUser, user } from "$lib/api/firebase";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
	import { onMount } from "svelte";
	import FriendCard from "./FriendCard.svelte";
	import { toast } from "svelte-sonner";

	let friends: User[];
	let friendRequests: User[];

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
			//res.user.friends[i].due = 0;
		}

		for (const i in res.user.friend_requests) {
			const requesterId: string = res.user.friend_requests[i];

			const user = await (
				await fetch("/api/v1/user/" + requesterId, {
					headers: {
						auth_token: u.uid,
					},
				})
			).json();

			res.user.friend_requests[i] = user.user;
		}

		friends = res.user.friends;
		friendRequests = res.user.friend_requests;
	};

	let emailToAdd = "";
	let open = false;

	const sendRequest = async () => {
		const friendId = await (
			await fetch(`/api/v1/user/get_id_from_email`, {
				method: "POST",
				headers: {
					auth_token: $user!.uid,
				},
				body: JSON.stringify({
					email: emailToAdd,
				}),
			})
		).json();

		if (friendId["passed"] == false) {
			toast.error("Cannot find user");
		}

		fetch(`/api/v1/user/${$user!.uid}/friend`, {
			method: "POST",
			headers: {
				auth_token: $user!.uid,
			},
			body: JSON.stringify({
				friend_id: friendId["id"],
			}),
		});

		toast.success("Friend request sent!");

		open = false;
	};

	const addFriend = (id: string) => {
		fetch(`/api/v1/user/${$user!.uid}/accept_request`, {
			method: "POST",
			headers: {
				auth_token: id,
			}
		});
	}

	onMount(() => {
		getFriends();
	})
</script>

<ScrollArea>
	<div class="flex flex-col gap-4">
		<h1 class="text-xl">Friends</h1>

		<Dialog.Root bind:open>
			<Dialog.Trigger class={buttonVariants({ variant: "fancy" })}>Add a Friend</Dialog.Trigger>

			<Dialog.Content class="w-[90%]">
				<Dialog.Header>
					<Dialog.Title>Add with Email</Dialog.Title>
				</Dialog.Header>

				<Input id="email" autocomplete="off" placeholder="john@appleseed.com" bind:value={emailToAdd} />

				<Dialog.Footer>
					<Button variant="fancy" on:click={sendRequest}>Add</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>

		{#if friends}
			{#each friends as friend}
				<a href={`/home/friends/${friend.id}`}>
					<FriendCard {friend} />
				</a>
				
			{/each}
		{/if}

		<h1 class="text-xl">Friend Requests</h1>

		{#if friendRequests}
			{#each friendRequests as request}
				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
						<FriendCard {request} />
					</Dialog.Trigger>

					<Dialog.Header>
						<Dialog.Title>Add friend?</Dialog.Title>
					</Dialog.Header>

					<Dialog.Footer>
						<Button variant="fancy" on:click={() => addFriend(request.id)}>Add</Button>
						<Button variant="fancy">Cancel</Button>
					</Dialog.Footer>
				</Dialog.Root>
				
			{/each}
		{/if}
	</div>
</ScrollArea>
