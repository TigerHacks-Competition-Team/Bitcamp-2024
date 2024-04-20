<script lang="ts">
	import { onAuthStateChanged } from "firebase/auth";
	import { onMount } from "svelte";
	import { auth, user } from "$lib/api/firebase";
	import SignIn from "./SignIn.svelte";
	import SignUp from "./SignUp.svelte";

	let screen = "sign-in";

	onMount(() => {
		onAuthStateChanged(auth, u => {
			$user = u;
		});
	});
</script>

<div>
	{#if screen == "sign-in"}
		<SignIn></SignIn>
	{:else}
		<SignUp></SignUp>
	{/if}
</div>
