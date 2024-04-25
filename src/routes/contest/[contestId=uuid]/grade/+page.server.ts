import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "$lib/components/grade/schema";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";

export const load = (async () => {
    return {
        form: await superValidate(zod(formSchema))
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }
        return {
            form
        };
    }
};
