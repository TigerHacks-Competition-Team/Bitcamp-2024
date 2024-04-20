<script lang="ts">
	import { onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";
    import { auth, user } from "$lib/api/firebase";
	import SignUp from "./SignUp.svelte";

    let screen = "sign-in";

    onMount(() => {
        onAuthStateChanged(auth, (u) => {
            $user = u;
        })
    });
</script>

<div>
    {#if screen == "sign-in"}
        <SignUp></SignUp>
    {:else}
        <div>

        </div>
    {/if}
</div>