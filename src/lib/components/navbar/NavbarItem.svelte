<script lang="ts">
	import { page } from "$app/stores";

    export let name = "Item";
    export let href = "";

    let className = "";
    export { className as class }
</script>

<a {href}>
    <div class={`flex flex-col items-center w-min ${className}`}>
        {#if $page.url.pathname.substring(6) == (href.substring(6))}
            <div class="navbarSelected">
                <slot />
            </div>
        {:else}
            <div>
                <slot />
            </div>
        {/if}
        <span>{name}</span>
    </div>
</a>

<style>
    .navbarSelected :global(path) {
        fill: url(#navbarIconSelectGrad);
        filter: drop-shadow(0px 0px 1px rgba(98, 220, 246, 0.25)) drop-shadow(0px 0px 4px rgba(98, 220, 246, 0.50));
    }
</style>