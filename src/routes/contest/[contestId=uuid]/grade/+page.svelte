<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import { page } from "$app/stores";
    import ArrowLeft from "lucide-svelte/icons/arrow-left";
    import IconButton from "$lib/components/utils/icon-button/IconButton.svelte";
    import { Resources } from "$lib/client/api_client";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import { isOngoing } from "$lib/contest_utils.js";
    import type { PageData } from "./$types";
    import { ensureLoggedIn } from "$lib/auth";
    import Warning from "$lib/components/Warning.svelte";
    import GradingView from "$lib/components/grade/GradingView.svelte";
    import Table_2 from "lucide-svelte/icons/table-2";
    import { LayoutGrid } from "lucide-svelte";
    import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
    import { ViewMode } from "$lib/components/grade/grade";
    import { writable } from "svelte/store";

    ensureLoggedIn($page);

    const contestId = $page.params.contestId;

    export let data: PageData;

    let viewMode: string
</script>

<Page pageName="Grade submissions">
    <div slot="navbar-left">
        <IconButton buttonName="Back to overview" href="overview" let:classes>
            <ArrowLeft class={classes}/>
        </IconButton>
    </div>
    <div class="w-full h-full p-4">
        {#await Resources.contest.contestIdPersonalGet({ id: contestId })}
            <p class="text-center">Loading...</p>
        {:then contest}
            <H2 class="m-0 p-0 leading-6 w-full text-center">Grade submissions for {contest.name}</H2>
            {#await Resources.grade.contestContestIdGradeListGet({ contestId })}
                <p class="text-center">Loading...</p>
            {:then toGrade}
                <div>
                    {#if isOngoing(contest)}
                        <Warning>Contest is still running, you can't grade yet</Warning>
                    {/if}
                </div>

                <div class="pt-4">
                    <div class="absolute flex flex-row right-4 -translate-y-12">
                        <Tabs bind:value={viewMode}>
                            <TabsList>
                                <TabsTrigger value={ViewMode.TABLE}>
                                    <Table_2/>
                                </TabsTrigger>
                                <TabsTrigger value={ViewMode.GRID}>
                                    <LayoutGrid/>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <GradingView mode={viewMode} data={writable(toGrade)} {contest} gradingForm={data.form}/>
                </div>
            {/await}
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </div>
</Page>
