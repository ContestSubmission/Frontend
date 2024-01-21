import { actions as actionsSearch, load as loadSearch } from "../+page.server";
import type { PageServerLoad } from "../$types";
import { Resources } from "$lib/client/api_client";

export const load = (({ url }) => {
    const term = url.searchParams.get("term") ?? "";

    return {
        streamed: {
            results: Resources.contest.contestSearchGet({ term })
        },
        ...loadSearch()
    };
}) satisfies PageServerLoad;

export const actions = actionsSearch;
