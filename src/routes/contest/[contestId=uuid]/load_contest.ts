import type { MySession } from "$lib/auth";
import { fail } from "@sveltejs/kit";
import { initApiClients, Resources } from "$lib/client/api_client";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { ZodSchema } from "zod";
import type { SuperValidated } from "sveltekit-superforms";
import { ContestDTO, type ContestResourceApi, type PersonalContestDTO } from "@contestsubmission/api-client";

export interface Params {
    contestId: string;
}

export async function loadContestAndForm<C extends ContestDTO>(
    formSchema: ZodSchema,
    locals: App.Locals,
    params: Params,
    formCustomizer: (form: SuperValidated<Record<string, never>>, contest: PersonalContestDTO) => void = (_) => {},
    getContest: (resource: ContestResourceApi) => C = (res) => res.contestIdPersonalGet({ id: params.contestId })
) {
    const session = (await locals.auth()) as (MySession | null);
    if (session == null) {
        throw fail(401);
    }
    let client = Resources.instance
    if (session?.access_token) {
        client = initApiClients(session.access_token)
    }
    const [form, contest] = await Promise.all([
        superValidate(zod(formSchema)),
        getContest(client.contestResource)
    ]);
    formCustomizer(form, contest)
    return {
        form,
        contest
    };
}
