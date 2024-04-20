<script lang="ts">
	import { auth } from "$lib/api/firebase";
	import { onMount } from "svelte";

	onMount(async () => {
		//const user = auth.currentUser;

		//if (!user) return;
		await fetch("/api/v1/pool/asfasdasd");
	});
</script>
