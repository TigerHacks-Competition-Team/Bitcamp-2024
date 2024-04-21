<script lang="ts">
	import { browser } from "$app/environment";
	import { auth, getUser } from "$lib/api/firebase";
	import type { User } from "firebase/auth";
	import { signOut } from "firebase/auth";
	import { user } from "$lib/api/firebase";
	import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";
	import Avatar from "$lib/components/Avatar.svelte";

	const getData = async () => {
		if (!browser) return;

		const u: User = await getUser();

		const res = await (
			await fetch("/api/v1/user/" + u.uid, {
				headers: {
					auth_token: u.uid,
				},
			})
		).json();

		if (!res.passed) return; //FIXME: Handle error

		return res.user;
	};

	const logOut = () => {
		signOut(auth);
		goto("/");
	};
</script>

{#await getData()}
    ...
{:then juser} 
    <div class="fixed -z-10 bg-[#1e1e22] inset-0 top-[20vh]"/>
    <div class="w-full flex justify-center p-20 pt-12 flex-col items-center gap-3">
        <Avatar firstName={juser.first_name[0]} lastName={juser.last_name[0]} editable={true} size={150} shadow={true}/>
        <div class="mt-3">
            <h1 class="text-[color:#B7BABE] text-3xl text-center">{juser.first_name} {juser.last_name}</h1>
            <h1 class="text-[color:#77787E] text-xl text-center">{$user?.email}</h1>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <p class="text-[#77787E] text-right">State</p>
            <p class="text-[#B7BABE]">${juser.address.state}</p>
            <p class="text-[#77787E] text-right">City</p>
            <p class="text-[#B7BABE]">${juser.address.city}</p>
            <p class="text-[#77787E] text-right">ZIP Code</p>
            <p class="text-[#B7BABE]">${juser.address.zip}</p>
            <p class="text-[#77787E] text-right">Address</p>
            <p class="text-[#B7BABE]">${juser.address.street_name} ${juser.address.street_number}</p>
        </div>
        <!-- <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#77787E] text-xl">{juser.address.city}, {juser.address.state}</h1> -->
        <!-- <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#77787E] text-xl">{juser.address.street_number} {juser.address.street_name} {juser.address.zip}</h1> -->
        <Button class="m-4" variant="fancy" on:click={logOut}>Log Out</Button>
    </div>
{/await}
