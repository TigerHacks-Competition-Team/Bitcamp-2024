<script lang="ts">
	import { onMount } from "svelte";

    export const shake = (amount: number) => {
        console.log(amount);
        slosh = 90;
    }

    onMount(() => {
        setInterval(() => {
            slosh = slosh / 2;
            if (Math.abs(slosh) < 0.2) slosh = 0;
        }, 200)
    })

    let slosh = 0;
</script>

<div on:mouseenter={e => {console.log(e); shake(e.movementX + e.movementY)}} class="aspect-square border-4 rounded-full border-black w-full h-full rotate-[{slosh}deg]">
    <div class="w-full h-full bg-[url('https://cdn.hswstatic.com/gif/water-update.jpg')] rounded-full bg-cover animate-flow"></div>
</div>