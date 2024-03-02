import {
    Configuration,
    ContestResourceApi,
    MetaResourceApi,
    ResponseError,
    SubmissionResourceApi,
    TeamInviteResourceApi,
    GradeResourceApi,
    TeamResourceApi
} from "@contestsubmission/api-client";

import { PUBLIC_BACKEND_BASE_PATH as BACKEND_BASE_PATH } from "$env/static/public";

export class Resources {

    static instance: Resources = new Resources(new Configuration({basePath: BACKEND_BASE_PATH}));

    private contestResource: ContestResourceApi;
    private teamResource: TeamResourceApi;
    private inviteResource: TeamInviteResourceApi;
    private submissionResource: SubmissionResourceApi;
    private gradeResource: GradeResourceApi;
    private meta: MetaResourceApi;

    constructor(config: Configuration) {
        this.contestResource = new ContestResourceApi(config);
        this.teamResource = new TeamResourceApi(config);
        this.inviteResource = new TeamInviteResourceApi(config);
        this.submissionResource = new SubmissionResourceApi(config);
        this.gradeResource = new GradeResourceApi(config);
        this.meta = new MetaResourceApi(config);
    }

    static get contest() {
        return Resources.instance.contestResource;
    }

    static get team() {
        return Resources.instance.teamResource;
    }

    static get invite() {
        return Resources.instance.inviteResource;
    }

    static get submission() {
        return Resources.instance.submissionResource;
    }

    static get grade() {
        return Resources.instance.gradeResource;
    }

    static get meta() {
        return Resources.instance.meta;
    }
}

export function initApiClients(access_token: string) {
    Resources.instance = constructApiClients(access_token);
}

export function constructApiClients(access_token: string) {
    return new Resources(createConfig(access_token));
}

export function createConfig(access_token: string) {
    return new Configuration({
        basePath: BACKEND_BASE_PATH,
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
}

/**
 * Handles the error by logging it and returning `null` instead
 */
export function responseErrorHandler(error: ResponseError): null {
    console.error("Response Error occurred!", error);
    return null
}
