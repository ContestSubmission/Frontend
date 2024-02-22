<script lang="ts">
    import Page from "../../../Page.svelte";
    import { page } from "$app/stores";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import { ArrowLeft } from "lucide-svelte";
    import { browser } from "$app/environment";
    import { signIn } from "@auth/sveltekit/client";
    import IconButton from "$lib/components/utils/IconButton.svelte";
    import { contestCache, loadContest } from "$lib/contest_cache";
    import type { Contest, GradeTeamOverviewDTO } from "@contestsubmission/api-client";
    import { Resources } from "$lib/client/api_client";

    if (browser && !$page.data.session) {
        signIn("oidc");
    }

    const contestId = $page.params.contestId;

    let contest: Promise<Contest> = $contestCache[contestId] ?? loadContest(contestId, $contestCache);
    let toGrade: Promise<GradeTeamOverviewDTO[]> = Resources.grade.contestContestIdGradeListGet({contestId});
</script>

<Page pageName="Grade submissions">
    <IconButton slot="navbar-left" href="overview">
        <ArrowLeft />
    </IconButton>
    <FullPageCentered>
        hi
        {#await contest}
            <p>Loading...</p>
        {:then contest}
            {#await toGrade}
                <p>Loading...</p>
            {:then toGrade}
                <h1>Grade submissions for {contest.name}</h1>
                <ul>
                    {#each toGrade as submission}
                        <li>
                            <a href="grade/{contestId}/{submission.teamId}">{submission.team.name}</a>
                            {JSON.stringify(submission)}
                        </li>
                    {/each}
                </ul>
            {/await}
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </FullPageCentered>
</Page>
