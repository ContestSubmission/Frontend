export function isOngoing(contest: { deadline: Date }) {
    return contest.deadline > new Date();
}
