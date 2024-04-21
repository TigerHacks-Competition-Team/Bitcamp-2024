<script lang="ts">
	import ArrowIcon from "./icons/ArrowIcon.svelte";
	import LoginIcon from "./icons/LoginIcon.svelte";

    export let text = "";
    export let icon: "none" | "login" | "arrow" = "none";


	import { Button } from "./ui/button";

</script>
<Button variant="fancy" class="gap-1 relative" on:click>
    <div class="absolute -inset-[1.5px] -z-10" style="background: var(--Light-Blue-Gradient, linear-gradient(90deg, #5FB4F2 0%, #B4F1FE 100%))">
    </div>
    <span
        style="background: var(--Light-Blue-Gradient, linear-gradient(90deg, #5FB4F2 0%, #B4F1FE 100%));background-clip: text;-webkit-background-clip: text;-webkit-text-fill-color: transparent;"
        >{text}</span
    >
    {#if icon === "login"}
        <LoginIcon size={20} color="#66A3EB" />
    {/if}
    {#if icon === "arrow"}
        <ArrowIcon size={20} color="#66A3EB" />
    {/if}
</Button>