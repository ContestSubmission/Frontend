<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import { page } from "$app/stores";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import AlertTriangle from "lucide-svelte/icons/alert-triangle";
    import ArrowLeft from "lucide-svelte/icons/arrow-left";
    import IconButton from "$lib/components/utils/icon-button/IconButton.svelte";
    import { Resources } from "$lib/client/api_client";
    import GradingTable from "./GradingTable.svelte";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import { isOngoing } from "$lib/contest_utils.js";
    import type { PageData } from "./$types";
    import { ensureLoggedIn } from "$lib/auth";

    ensureLoggedIn($page);

    const contestId = $page.params.contestId;

    export let data: PageData;
</script>

<Page pageName="Grade submissions">
    <div slot="navbar-left">
        <IconButton buttonName="Back to overview" href="overview" let:classes>
            <ArrowLeft class={classes}/>
        </IconButton>
    </div>
    <FullPageCentered>
        {#await Resources.contest.contestIdPersonalGet({ id: contestId })}
            <p>Loading...</p>
        {:then contest}
            <H2 class="m-0 p-0 leading-6">Grade submissions for {contest.name}</H2>
            {#await Resources.grade.contestContestIdGradeListGet({ contestId })}
                <p>Loading...</p>
            {:then toGrade}
                <div class="mb-4">
                    {#if isOngoing(contest)}
                        <div class="w-full flex justify-center items-center text-orange-400">
                            <AlertTriangle/>
                            <p class="ml-2">Contest is still running, you can't grade yet</p>
                        </div>
                    {/if}
                </div>

                <GradingTable data={toGrade} {contest} gradingForm={data.form}/>
            {/await}
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </FullPageCentered>
</Page>
