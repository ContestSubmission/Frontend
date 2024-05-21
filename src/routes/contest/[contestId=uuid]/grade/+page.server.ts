import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "$lib/components/grade/schema";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { initApiClients, Resources } from "$lib/client/api_client";
import type { MySession } from "$lib/auth";

export const load = (async ({params, locals}) => {
    const session = (await locals.auth()) as (MySession | null);
    if (session == null) {
        throw fail(401);
    }
    let client = Resources.instance
    if (session?.access_token) {
        client = initApiClients(session.access_token)
    }
    return {
        form: await superValidate(zod(formSchema)),
        contest: await client.contestResource.contestIdPersonalGet({ id: params.contestId })
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
