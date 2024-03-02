import { writable, type Writable } from "svelte/store";
import type { uuid } from "$lib/types";
import type { PersonalContestDTO } from "@contestsubmission/api-client";
import { Resources } from "$lib/client/api_client";

export const contestCache: Writable<Record<uuid, PersonalContestDTO>> = writable({});

/**
 * Fetches a contest and stores it in the contest cache.
 */
export async function loadContest(contestId: uuid, contestCache: Record<uuid, PersonalContestDTO>): Promise<PersonalContestDTO> {
    const data = await Resources.contest.contestIdPersonalGet({ id: contestId });
    console.debug("Re-fetched contest data as not in cache");
    contestCache[contestId] = data;
    return data;
}

export function clearContestCache(contestId?: uuid) {
    if (contestId) {
        contestCache.update(cache => {
            delete cache[contestId];
            console.debug("Cleared contest cache for contest", contestId);
            return cache;
        })
    } else {
        contestCache.set({});
        console.debug("Cleared contest cache");
    }
}

export function mayResolve<T>(obj: T | null | undefined): Promise<T> | null {
    if (obj === null || obj === undefined) {
        return null;
    }

    return Promise.resolve(obj);
}
