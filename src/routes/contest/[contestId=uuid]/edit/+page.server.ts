import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import { createConfig } from "$lib/client/api_client";
import { type ContestIdPutRequest, ContestResourceApi, type ContestUpdateDTO } from "@contestsubmission/api-client";
import type { MySession } from "$lib/auth";
import { loadContestAndForm } from "../load_contest";
import { isOngoing } from "$lib/contest_utils";

export const load =
    (async (event) => {
        const { locals, params } = event
        const session = await locals.auth() as MySession | null;
        if (!session) return redirect(302, "/signin")

        return loadContestAndForm(
            formSchema(false),
            locals,
            params,
            (form, contest) => {
                const data = form.data as ContestUpdateDTO
                Object.keys(data).forEach(key => {
                    // @ts-expect-error can't be used to index yada yada who cares
                    data[key] = contest[key] ?? null
                })
                // fix cuz iteration ain't workin idk
                data.deadline = contest.deadline
            },
            res => res.contestIdGet({ id: params.contestId })
        );
    }) satisfies PageServerLoad

export const actions: Actions = {
    default: async (event) => {
        const session = await event.locals.auth() as MySession | null;
        if (!session) return fail(401);

        const contestId = event.params.contestId;

        const contestResource = new ContestResourceApi(createConfig(session.access_token));
        const contest = await contestResource.contestIdGet({
            id: contestId
        })

        const form = await superValidate(event, zod(formSchema(isOngoing(contest))));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        const requestParams: ContestIdPutRequest = {
            id: contestId,
            contestUpdateDTO: form.data
        };

        await contestResource.contestIdPut(requestParams);

        return redirect(302, `/contest/${contestId}/overview`);
    }
}
