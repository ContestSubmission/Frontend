import type { Actions, PageServerLoad } from "./$types";
import { action as teamCreateAction, form as teamCreateForm } from "./team/create-team-form";
import { action as submissionUploadAction, form as submissionUploadForm } from "./submission/upload-submission-form";

export const load = (async ({ url }) => {
    return {
        submissionUploadForm: await submissionUploadForm(),
        teamCreateForm: await teamCreateForm(),
        fromInvite: url.searchParams.get("fromInvite") == "true"
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    submissionUpload: submissionUploadAction,
    teamCreate: teamCreateAction
};
