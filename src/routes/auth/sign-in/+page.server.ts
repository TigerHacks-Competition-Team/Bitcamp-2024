import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from '../$types.js';
import { authSchema } from '../authSchema.js';
import { goto } from '$app/navigation';
import { auth, user, signInEmailAndPassword } from "$lib/api/firebase";
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {  
	return {
		form: await superValidate(zod(authSchema))
	};
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(authSchema));

        if (form.valid) {
            signInEmailAndPassword(form.data.email, form.data.password);
        }

        return { form }
    }
}
