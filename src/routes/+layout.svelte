<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/api/firebase';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import "@fontsource/poppins";
</script>

<Toaster theme="light"/>
<slot />