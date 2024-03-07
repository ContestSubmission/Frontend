import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./upload-submission-schema";
import { type Action, fail } from "@sveltejs/kit";

export const form = async () => await superValidate(zod(formSchema))

export const action: Action = async (event) => {
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
