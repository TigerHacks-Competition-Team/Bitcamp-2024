<script lang="ts">
	import { onAuthStateChanged } from "firebase/auth";
    import { onMount } from "svelte";
    import { auth, user } from "$lib/api/firebase";
	import SignUp from "./SignUp.svelte";
	import type { PageData } from "../$types";
	import { goto } from "$app/navigation";
	import { redirect } from "@sveltejs/kit";

    let screen = "sign-in";
</script>
