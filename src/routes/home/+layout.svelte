<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/api/firebase';
	import Navbar from '$lib/components/navbar/Navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import '../../app.css';
</script>

<Toaster />
<div class="h-screen bg-background">
	<slot/>
</div>

<Navbar></Navbar>