import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./upload-schema";
import { fail } from "@sveltejs/kit";

export const load = (({ url }) => {
    return {
        form: superValidate(formSchema),
        fromInvite: url.searchParams.get("fromInvite") == "true"
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, formSchema);
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
