import type { Contest, PersonalContestDTO } from "@contestsubmission/api-client";

export function isOngoing(contest: PersonalContestDTO | Contest) {
    return contest.deadline > new Date();
}
