<script lang="ts">
	import Button from "../ui/button/button.svelte";
	import PlusOutlineIcon from "../icons/PlusOutlineIcon.svelte";
	import NavbarItem from "./NavbarItem.svelte";
	import DropletIcon from "../icons/DropletIcon.svelte";
	import GlobeOutlineIcon from "../icons/GlobeOutlineIcon.svelte";
	import PersonOutlineIcon from "../icons/PersonOutlineIcon.svelte";
	import CreditCardOutlineIcon from "../icons/CreditCardOutlineIcon.svelte";
	import { page } from "$app/stores";

    console.log($page.url.pathname);
</script>

<div class="w-full h-[100px] px-[30px] py-[20px]
            fixed bottom-0 flex justify-between
            border-border border-t bg-background">
    <NavbarItem name="Pools" href="/home">
        {#if $page.url.pathname == "/home"}
            <DropletIcon size={30} class="bg-gradient-blue-vertical"/>
        {:else}
            <DropletIcon size={30}/>
        {/if}
    </NavbarItem>

    <NavbarItem name="Friends" href="/home/friends">
        {#if $page.url.pathname == "/home/friends"}
            <GlobeOutlineIcon size={30} class="bg-gradient-blue-vertical"/>
        {:else}
            <GlobeOutlineIcon size={30}/>
        {/if}
    </NavbarItem>

    <span></span>

    <NavbarItem name="Profile" href="/home/profile">
        {#if $page.url.pathname == "/home/profile"}
            <PersonOutlineIcon size={30} class="bg-gradient-blue-vertical"/>
        {:else}
            <PersonOutlineIcon size={30}/>
        {/if}
    </NavbarItem>

    <NavbarItem name="Wallet" href="/home/wallet">
        {#if $page.url.pathname == "/home/wallet"}
            <CreditCardOutlineIcon size={30} class="bg-gradient-blue-vertical"/>
        {:else}
            <CreditCardOutlineIcon size={30}/>
        {/if}
    </NavbarItem>

    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Button variant="outline" class=" w-[60px] h-[60px] bg-gradient-blue-vertical drop-shadow-blue-glow rounded-full">
            <PlusOutlineIcon size={40}></PlusOutlineIcon>
        </Button>
    </div>
    
</div>