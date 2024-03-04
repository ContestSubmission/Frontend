import { actions as actionsSearch, load as loadSearch } from "../+page.server";
import type { PageServerLoad } from "../$types";
import { Resources } from "$lib/client/api_client";

export const load = (async ({ url }) => {
    const term = url.searchParams.get("term") ?? "";

    return {
        streamed: {
            results: Resources.contest.contestSearchGet({ term })
        },
        ...await loadSearch()
    };
}) satisfies PageServerLoad;

export const actions = actionsSearch;
