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

        const res = await (await fetch("/api/v1/user/"+u.uid    , {
			headers: {
				auth_token:
					u.uid
            },
		})).json();

        if(!res.passed) return; //FIXME: Handle error

        return res.user;
	}

    const logOut = () => {
        signOut(auth);
        goto("/");
    }
</script>

{#await getData()}
    ...
{:then juser} 
    <div class="w-full flex justify-center p-20 pt-12 flex-col items-center">
        <Avatar firstName={juser.first_name[0]} lastName={juser.last_name[0]}/>
        <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#B7BABE] text-3xl">{juser.first_name} {juser.last_name}</h1>
        <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#77787E] text-xl">{$user?.email}</h1>
        <span class="h-8"/>
        <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#77787E] text-xl">{juser.address.city}, {juser.address.state}</h1>
        <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#77787E] text-xl">{juser.address.street_number} {juser.address.street_name} {juser.address.zip}</h1>
        <Button class="m-4" variant="fancy" on:click={logOut}>Log Out</Button>
    </div>
{/await}