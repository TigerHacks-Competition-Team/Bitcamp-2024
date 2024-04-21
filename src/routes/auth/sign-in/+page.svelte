<script lang="ts">
	import Input from "$lib/components/ui/input/input.svelte";
	import { signInEmailAndPassword } from "$lib/api/firebase";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import LoginIcon from "$lib/components/icons/LoginIcon.svelte";
	import { auth } from "$lib/api/firebase";
	import Separator from "$lib/components/ui/separator/separator.svelte";

	let email = "";
	let password = "";

	const onSubmit = () => {
		signInEmailAndPassword(email, password)
			.catch(e => {
				toast(`${e.name}: ${e.code}`);
			})
			.then(() => {
				if (auth.currentUser) goto("/home");
			});
	};
</script>

<div>
	<div
		class="fixed inset-0"
		style="background: radial-gradient(57.01% 13.63% at 50% 0%, #111E2D 0%, #17181D 100%), #17181D"
	></div>
	<form on:submit|preventDefault={onSubmit}>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 w-[80vw]">
			<h1 class="text-3xl text-center mb-2">Log In</h1>
			<Input placeholder="Email" bind:value={email} />
			<Input placeholder="Password" type="password" class="mb-2" bind:value={password} />
			<Button variant="fancy" type="submit">
				<LoginIcon size={20} color="#66A3EB" class="mr-1" />
				Sign In
			</Button>
			<Separator />
			<p class="text-muted-foreground text-xs text-center">
				Need an account? <a href="/auth/sign-up" class="cursor-pointer text-primary-foreground hover:underline"
					>Sign up</a
				> instead.
			</p>
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
				<Button variant="fancy" type="submit">Sign in</Button>
			</div>
		</div> -->
	</form>
	<a href="/">Back</a>
</div>
