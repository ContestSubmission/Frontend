import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import { createConfig } from "$lib/client/api_client";
import { type ContestPostRequest, ContestResourceApi } from "@contestsubmission/api-client";
import type { MySession } from "$lib/auth";

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

        const session = await event.locals.auth() as MySession | null;
        if (!session) return fail(401);

        const requestParams: ContestPostRequest = {
            contestCreateDTO: form.data
        };

        const contestResource = new ContestResourceApi(createConfig(session.access_token));
        const contest = await contestResource.contestPost(requestParams);

        return redirect(302, `/contest/${contest.id}/overview`);
    }
}
