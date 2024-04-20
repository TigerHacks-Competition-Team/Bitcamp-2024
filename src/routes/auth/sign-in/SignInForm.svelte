<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Form from '$lib/components/ui/form';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { authSchema, type AuthSchema } from '../authSchema';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<AuthSchema>>;

	const form = superForm(data, {
		validators: zodClient(authSchema)
	});

    const { form: formData, enhance, validate } = form;
</script>

<div>
	<form method="POST" use:enhance>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input {...attrs} type="password" bind:value={$formData.password} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button>Sign in</Form.Button>
	</form>
</div>
