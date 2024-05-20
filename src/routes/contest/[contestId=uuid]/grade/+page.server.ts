import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "$lib/components/grade/schema";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { Resources } from "$lib/client/api_client";

export const load = (async ({params}) => {
    return {
        form: await superValidate(zod(formSchema)),
        contest: await Resources.contest.contestIdPersonalGet({ id: params.contestId })
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
