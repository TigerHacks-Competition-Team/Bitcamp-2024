<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { signUpEmailAndPassword } from '$lib/api/firebase';
	import { updateProfile } from 'firebase/auth';

	let email = '';
	let password = '';

	const onSubmit = () => {
		signUpEmailAndPassword(email, password).then(async (e) => {
			await updateProfile(e.user, {
				displayName: `${email}`
			});
		});
	};
</script>

<div>
	<form on:submit|preventDefault={onSubmit}>
		<div>
			<div>
				<div>
					<Label for="signin-email">Email</Label>
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
					<Label for="signin-password">Password</Label>
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
				<Button type="submit">Sign up</Button>
			</div>
		</div>
	</form>
</div>
