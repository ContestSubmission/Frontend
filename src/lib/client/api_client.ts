import {
    ContestResourceApi,
    TeamResourceApi,
    Configuration,
    SubmissionResourceApi
} from "@contestsubmission/api-client";

import {
    PUBLIC_BACKEND_BASE_PATH as BACKEND_BASE_PATH
} from "$env/static/public"

export class Resources {

    static instance: Resources = new Resources(new Configuration({basePath: BACKEND_BASE_PATH}));

    private contestResource: ContestResourceApi;
    private teamResource: TeamResourceApi;
    private submissionResource: SubmissionResourceApi;

    constructor(config: Configuration) {
        this.contestResource = new ContestResourceApi(config);
        this.teamResource = new TeamResourceApi(config);
        this.submissionResource = new SubmissionResourceApi(config);
    }

    static get contest() {
        return Resources.instance.contestResource;
    }

    static get team() {
        return Resources.instance.teamResource;
    }

    static get submission() {
        return Resources.instance.submissionResource;
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
