<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
    import * as Form from '$lib/components/ui/form';
	import { user, auth } from '$lib/api/firebase';
	import { goto } from '$app/navigation';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { authSchema, type AuthSchema } from '../authSchema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import type { PageData } from '../$types';
	import SignInForm from './SignInForm.svelte';

    export let data: PageData;

    onMount(() => {
        onAuthStateChanged(auth, (u) => {
            $user = u;

            if ($user != undefined) {
                goto("/home/")
            }
        })
    })
</script>

<div>
	<SignInForm data={data.form}/>
</div>
