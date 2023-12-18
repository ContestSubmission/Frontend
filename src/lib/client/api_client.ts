import {ContestResourceApi, Configuration} from "@contestsubmission/api-client";

import {
    PUBLIC_BACKEND_BASE_PATH as BACKEND_BASE_PATH
} from "$env/static/public"

const config = new Configuration({
    basePath: BACKEND_BASE_PATH
});

export const contestResource = new ContestResourceApi(config);
