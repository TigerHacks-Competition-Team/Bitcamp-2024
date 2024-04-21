<script lang="ts">
	import { page } from "$app/stores";

    export let name = "Item";
    export let href = "";

    let className = "";
    export { className as class }
</script>

<a {href} class="hover:brightness-125 active:brightness-125 transition-all">
    <div class={`flex flex-col items-center w-min ${className}`}>
        {#if $page.url.pathname.substring(6) == (href.substring(6))}
            <div class="navbarSelected">
                <slot />
            </div>
            <span class="text-[11px]" style="background: var(--Blue-Up-Blue-Up-Down-Gradient, linear-gradient(180deg, #62DCF6 0%, #5FB4F2 100%));background-clip: text;-webkit-background-clip: text;-webkit-text-fill-color: transparent;">{name}</span>
        {:else}
            <div>
                <slot />
            </div>
            <span class="text-[11px] text-[#575762]">{name}</span>
        {/if}
    </div>
</a>

<style>
    .navbarSelected :global(path) {
        fill: url(#navbarIconSelectGrad);
        filter: drop-shadow(0px 0px 1px rgba(98, 220, 246, 0.25)) drop-shadow(0px 0px 4px rgba(98, 220, 246, 0.50));
    }
</style>