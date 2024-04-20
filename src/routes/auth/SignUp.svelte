<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import { signUpEmailAndPassword, auth } from "$lib/api/firebase";
	import { updateProfile } from "firebase/auth";

	let email = "";
	let password = "";

	const onSubmit = () => {
		signUpEmailAndPassword(email, password).then(async e => {
			await updateProfile(e.user, {
				displayName: `${email}`,
			});

			if (!auth.currentUser) return;
			await fetch("/api/v1/create_user", {
				method: "POST",
				body: JSON.stringify({
					first_name: "John",
					last_name: "Doe",
					auth_token: await auth.currentUser.getIdToken(),
					address: {
						street_number: "123",
						street_name: "Main St",
						city: "Springfield",
						state: "IL",
						zip: "62701",
					},
				}),
			});
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
				<Button type="submit">Sign up</Button>
			</div>
		</div>
	</form>
</div>
