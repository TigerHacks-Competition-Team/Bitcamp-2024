<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/api/firebase';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import "@fontsource/poppins/300.css";
	import '../../app.css';
</script>

<Toaster />
<div class="h-[calc(100vh-100px)] p-4">
	<slot/>
</div>

<Navbar></Navbar>