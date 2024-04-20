<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { signInEmailAndPassword, user } from '$lib/api/firebase';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';

	const onSubmit = () => {
		signInEmailAndPassword(email, password)
            .then((e) => {
                if ($user !== undefined) {
                    goto("/home/");
                }
            });
	};
</script>

<div>
	<form on:submit|preventDefault={onSubmit}>
		<div>
			<div>
				<div>
					<Label for="email">Email</Label>
					<Input
						id="signin-email"
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
						id="signin-password"
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
		</div>
	</form>
</div>
