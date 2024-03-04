import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import { Resources } from "$lib/client/api_client";

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema))
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        const contest = await Resources.contest.contestPost({
            contestCreateDTO: form.data
        });

        return redirect(302, `/contest/${contest.id}/overview`);
    }
}
