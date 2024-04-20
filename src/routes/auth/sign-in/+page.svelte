<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { signInEmailAndPassword } from '$lib/api/firebase';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';

    let email = "";
    let password = "";

    const onSubmit = () => {
        signInEmailAndPassword(email, password);
    }
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
