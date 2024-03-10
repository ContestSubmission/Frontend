import type { Action } from "../$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./create-team-schema";
import { fail  } from "@sveltejs/kit";
import { createConfig } from "$lib/client/api_client";
import { type ContestContestIdTeamPostRequest, TeamResourceApi } from "@contestsubmission/api-client";
import type { MySession } from "$lib/auth";

export const form = async () => await superValidate(zod(formSchema))

export const action: Action = async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
        return fail(400, {
            form
        });
    }

    const session = await event.locals.auth() as MySession | null;
    if (!session) return fail(401);

    const contestId = event.params.contestId;

    const requestParams: ContestContestIdTeamPostRequest = {
        contestId,
        teamCreateDTO: form.data
    };

    const contestResource = new TeamResourceApi(createConfig(session.access_token));
    await contestResource.contestContestIdTeamPost(requestParams);

    return {
        form
    }
}
