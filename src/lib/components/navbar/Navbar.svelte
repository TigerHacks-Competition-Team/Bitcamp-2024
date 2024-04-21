<script lang="ts">
	import Button from "../ui/button/button.svelte";
	import PlusOutlineIcon from "../icons/PlusOutlineIcon.svelte";
	import NavbarItem from "./NavbarItem.svelte";
	import DropletIcon from "../icons/DropletIcon.svelte";
	import GlobeOutlineIcon from "../icons/GlobeOutlineIcon.svelte";
	import PersonOutlineIcon from "../icons/PersonOutlineIcon.svelte";
	import CreditCardOutlineIcon from "../icons/CreditCardOutlineIcon.svelte";
    import Gradient from "../icons/Gradient.svelte";
</script>

<Gradient id="navbarIconSelectGrad"/>

<div class="w-full h-[100px] px-[30px] py-[20px]
            fixed bottom-0 flex justify-between
            border-border border-t bg-[#1e1e22]">
    <NavbarItem name="Pools" href="/home/">
        <DropletIcon size={28}/>
    </NavbarItem>

    <NavbarItem name="Friends" href="/home/friends">
            <GlobeOutlineIcon size={28}/>
    </NavbarItem>

    <span class="w-[28px]"></span>

    <NavbarItem name="Profile" href="/home/profile">
        <PersonOutlineIcon size={28}/>
    </NavbarItem>

    <NavbarItem name="Wallet" href="/home/wallet">
        <CreditCardOutlineIcon size={28}/>
    </NavbarItem>

    <a href="/home/new" class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:brightness-[1.1] active:brightness-[1.1] transition-all">
        <Button variant="outline" class=" w-[60px] h-[60px] bg-gradient-blue-vertical drop-shadow-blue-glow rounded-full"
        style="filter: drop-shadow(0px 1.6px 4px rgba(98, 220, 246, 0.25)) drop-shadow(0px 0px 50px rgba(98, 220, 246, 0.50));">
            <PlusOutlineIcon size={40}></PlusOutlineIcon>
        </Button>
    </a>
    
</div>