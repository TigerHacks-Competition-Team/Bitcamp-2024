<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Label from "$lib/components/ui/label/label.svelte";
	import { signUpEmailAndPassword, auth } from "$lib/api/firebase";
	import { updateProfile } from "firebase/auth";
	import { toast } from "svelte-sonner";

    let name = ""
	let email = "";
	let password = "";

	const onSubmit = () => {
		signUpEmailAndPassword(email, password).then(async e => {
			await updateProfile(e.user, {
				displayName: `${name}`,
			});

			if (!auth.currentUser) return;
			await fetch("/api/v1/create_user", {
				method: "POST",
				headers: {
					"auth_token": auth.currentUser.uid,
				},
				body: JSON.stringify({
					first_name: "John",
					last_name: "Doe",
					address: {
						street_number: "123",
						street_name: "Main St",
						city: "Springfield",
						state: "IL",
						zip: "62701",
					},
				}),
			});
		}).catch(e => {
			toast(`${e.name}: ${e.code}`);
		});
	};
</script>

<div>
	<form on:submit|preventDefault={onSubmit}>
		<div>
			<div>
                <div>
                    <Label for="email">Name</Label>
					<Input
						id="email"
						placeholder="John Appleseed"
						autocapitalize="none"
						autocorrect="off"
						bind:value={name}
					/>
                </div>
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
	<a href="/">Back</a>
</div>
