<script lang="ts">
	import { onMount } from "svelte";
	import "./Water.css";

	export let waterHeight: number;
	export let style: string = "";
</script>

<div class={`aspect-square border-2 rounded-full border-black w-full h-full flex flex-col overflow-hidden ${style}`}>
	<svg
		class="waves mt-auto"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 150 150"
		preserveAspectRatio="none"
		shape-rendering="auto"
	>
		<defs>
			<path
				id="gentle-wave"
				d={`M-160 ${(1-waterHeight) * 140 - 10} c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v150h-352z`}
			/>
		</defs>
		<g class="parallax">
			<use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(100, 210, 255, 0.7" />
			<use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(100, 210, 255, 0.5)" />
			<use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(100, 210, 255, 0.3)" />
			<use xlink:href="#gentle-wave" x="48" y="7" fill="rgb(100, 210, 255)" />
		</g>
	</svg>
</div>
