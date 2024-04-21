<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { signInEmailAndPassword } from '$lib/api/firebase';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import FancyButton from '$lib/components/FancyButton.svelte';

    let email = "";
    let password = "";

    const onSubmit = () => {
        signInEmailAndPassword(email, password).catch(e => {
			toast(`${e.name}: ${e.code}`);
		}).then(() => {
			goto("/home");
		});;
    }
</script>

<div>
	<form on:submit|preventDefault={onSubmit}>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 w-[80vw]">
			<h1 class="text-3xl text-center mb-2">Log In</h1>
			<Input placeholder="Email"/>
			<Input placeholder="Password" type="password" class="mb-2"/>
			<FancyButton text="Sign In" icon="login"/>
		</div>
		<!-- <div>
			<div>
				<div>
					<Label for="email">Email</Label>
					<Input
						id="email"
						placeholder="johnny@appleseed.com"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						bind:value={email}
					/>
				</div>
				<div>
					<Label for="password">Password</Label>
					<Input
						id="password"
						placeholder=""
						type="password"
						autocapitalize="none"
						autocomplete="password"
						autocorrect="off"
						bind:value={password}
					/>
				</div>
				<Button type="submit">Sign in</Button>
			</div>
		</div> -->
	</form>
	<a href="/">Back</a>
</div>
