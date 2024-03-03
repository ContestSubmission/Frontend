<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import { page } from "$app/stores";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import { AlertTriangle, ArrowLeft } from "lucide-svelte";
    import { browser } from "$app/environment";
    import { signIn } from "@auth/sveltekit/client";
    import IconButton from "$lib/components/utils/IconButton.svelte";
    import { contestCache, loadContest } from "$lib/contest_cache";
    import type { GradeTeamOverviewDTO, PersonalContestDTO } from "@contestsubmission/api-client";
    import { Resources } from "$lib/client/api_client";
    import GradingTable from "./GradingTable.svelte";
    import { mayResolve } from "$lib/contest_cache.js";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import { isOngoing } from "$lib/contest_utils.js";
    import type { PageData } from "./$types";

    if (browser && !$page.data.session) {
        signIn("oidc");
    }

    const contestId = $page.params.contestId;

    let contest: Promise<PersonalContestDTO> = mayResolve($contestCache[contestId])
        ?? loadContest(contestId, $contestCache);
    let toGrade: Promise<GradeTeamOverviewDTO[]> = Resources.grade.contestContestIdGradeListGet({contestId});

    export let data: PageData;
</script>

<Page pageName="Grade submissions">
    <IconButton slot="navbar-left" href="overview">
        <ArrowLeft />
    </IconButton>
    <FullPageCentered>
        {#await contest}
            <p>Loading...</p>
        {:then contest}
            <H2 class="m-0 p-0 leading-6">Grade submissions for {contest.name}</H2>
            {#await toGrade}
                <p>Loading...</p>
            {:then toGrade}
                <div class="mb-4">
                    {#if isOngoing(contest)}
                        <div class="w-full flex justify-center text-orange-400">
                            <AlertTriangle/>
                            <p class="ml-2">Contest is still running, you can't grade yet</p>
                        </div>
                    {/if}
                </div>

                <GradingTable data={toGrade} {contest} form={data.form} />
            {/await}
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </FullPageCentered>
</Page>
