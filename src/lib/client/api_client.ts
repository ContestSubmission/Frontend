import {ContestResourceApi, TeamResourceApi, Configuration} from "@contestsubmission/api-client";

import {
    PUBLIC_BACKEND_BASE_PATH as BACKEND_BASE_PATH
} from "$env/static/public"

export class Resources {

    static instance: Resources = new Resources(new Configuration({basePath: BACKEND_BASE_PATH}));

    private contestResource: ContestResourceApi;
    private teamResource: TeamResourceApi;

    constructor(config: Configuration) {
        this.contestResource = new ContestResourceApi(config);
        this.teamResource = new TeamResourceApi(config);
    }

    static get contest() {
        return Resources.instance.contestResource;
    }

    static get team() {
        return Resources.instance.teamResource;
    }
}

export function initApiClients(access_token: string) {
    const config = new Configuration({
        basePath: BACKEND_BASE_PATH,
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    Resources.instance = new Resources(config)
}
