import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./upload-schema";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";

export const load = (async ({ url }) => {
    return {
        form: await superValidate(zod(formSchema)),
        fromInvite: url.searchParams.get("fromInvite") == "true"
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
