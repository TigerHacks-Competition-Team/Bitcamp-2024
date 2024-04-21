<script lang="ts">
	import { browser } from "$app/environment";
	import { auth, getUser } from "$lib/api/firebase";
	import type { User } from "firebase/auth";
    import { signOut } from "firebase/auth";
    import { user } from "$lib/api/firebase";
	import { Button } from "$lib/components/ui/button";
	import { goto } from "$app/navigation";
    
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

    getData();
</script>

{#await getData()}
    ...
{:then juser} 
    <div class="w-full flex justify-center p-20 pt-12 flex-col items-center">
        <div style="background: radial-gradient(72.86% 72.86% at 50% 100%, #323234 0%, rgba(50, 50, 52, 0.00) 100%), #26262B;" class="mb-10 relative border-[#414142] border-[10px] w-full h-full max-w-96 aspect-square rounded-full">
            <h1 class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scroll-m-20 font-extrabold tracking-tight lg:text-5xl font-[Poppins] [color:#B7BABE] text-[72px]">{juser.first_name[0] + juser.last_name[0]}</h1>
            <div style="background: radial-gradient(71.69% 48% at 50% 98%, #2F4052 0%, rgba(28, 39, 51, 0.00) 100%), #1C2733;" class="border border-[#66A3EB] absolute top-[70.7%] left-[70.7%] w-1/3 aspect-square rounded-full flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 27 27" fill="none">
                    <path d="M20.3203 3.42944H7.32031C6.45836 3.42944 5.63171 3.77185 5.02222 4.38135C4.41272 4.99084 4.07031 5.81749 4.07031 6.67944V19.6794C4.07031 20.5414 4.41272 21.368 5.02222 21.9775C5.63171 22.587 6.45836 22.9294 7.32031 22.9294H20.3203C21.1823 22.9294 22.0089 22.587 22.6184 21.9775C23.2279 21.368 23.5703 20.5414 23.5703 19.6794V6.67944C23.5703 5.81749 23.2279 4.99084 22.6184 4.38135C22.0089 3.77185 21.1823 3.42944 20.3203 3.42944ZM7.32031 5.59611H20.3203C20.6076 5.59611 20.8832 5.71025 21.0863 5.91341C21.2895 6.11658 21.4036 6.39213 21.4036 6.67944V15.7361L17.937 12.7786C17.3999 12.3367 16.7259 12.095 16.0303 12.095C15.3347 12.095 14.6608 12.3367 14.1236 12.7786L6.23698 19.3544V6.67944C6.23698 6.39213 6.35112 6.11658 6.55428 5.91341C6.75744 5.71025 7.03299 5.59611 7.32031 5.59611Z" fill="#66A3EB"/>
                    <path d="M9.48682 11.0128C10.3843 11.0128 11.1118 10.2853 11.1118 9.38782C11.1118 8.49035 10.3843 7.76282 9.48682 7.76282C8.58935 7.76282 7.86182 8.49035 7.86182 9.38782C7.86182 10.2853 8.58935 11.0128 9.48682 11.0128Z" fill="#66A3EB"/>
                </svg>
            </div>
        </div>
        <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#B7BABE] text-3xl">{juser.first_name} {juser.last_name}</h1>
        <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#77787E] text-xl">{$user?.email}</h1>
        <span class="h-8"/>
        <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#77787E] text-xl">{juser.address.city}, {juser.address.state}</h1>
        <h1 class="scroll-m-20 font-extrabold tracking-tight lg:text-5xl text-[color:#77787E] text-xl">{juser.address.street_number} {juser.address.street_name} {juser.address.zip}</h1>
        <Button class="m-4" on:click={logOut}>Log Out</Button>
    </div>
{/await}