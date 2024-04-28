<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import { page } from "$app/stores";
    import type { PersonalContestDTO, Submission } from "@contestsubmission/api-client";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import { toast } from "svelte-sonner";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import ContestOverviewComponent from "./ContestOverviewComponent.svelte";
    import type { PageData } from "./$types";
    import { Resources } from "$lib/client/api_client";
    import { loadingContest } from "$lib/loading_utils";

    const contestId = $page.params.contestId;

    let lastSubmission: Submission | null;

    async function retrieveContest() {
        let contest = await Resources.contest.contestIdPersonalGet({ id: contestId });

        lastSubmission = contest.submissions?.reduce((prev: Submission | null, curr: Submission) => {
            if (prev == null) return curr;
            if (curr.handedInAt > prev.handedInAt) return curr;
            return prev;
        }, null) ?? null;

        return contest;
    }

    onMount(() => {
        if (browser && $page.data.fromInvite) {
            toast.success("Joined Contest", {
                description: "Successfully joined this contest. Good luck!",
                duration: Number.POSITIVE_INFINITY,
                classes: {
                    toast: "bg-secondary"
                }
            });

            // remove the fromInvite flag from the URL
            // this is done to prevent the toast from showing again if the user refreshes the page
            let query = new URLSearchParams($page.url.searchParams.toString());
            query.delete("fromInvite");
            goto("?" + query.toString(), { replaceState: true });
        }
    });

    export let data: PageData;

    // the fallback avoids loading the contest while authentication is still in progress (which would fail)
    // this is required due to https://github.com/sveltejs/svelte/issues/10501
    let contestPromise: Promise<PersonalContestDTO> = browser ? retrieveContest() : new Promise(() => {});
    function refreshContest() {
        console.debug("Change processed, refreshing contest...")
        contestPromise = retrieveContest();
    }
</script>

<Page pageName="Contest overview">
    <FullPageCentered>
        <Container class="p-4 min-w-[40rem]">
            {#await contestPromise}
                <ContestOverviewComponent
                    contest={loadingContest}
                    loaded={false}
                    uploadForm={data.submissionUploadForm}
                    teamCreateForm={data.teamCreateForm}
                />
            {:then contest}
                <ContestOverviewComponent
                    {contest}
                    {lastSubmission}
                    uploadForm={data.submissionUploadForm}
                    teamCreateForm={data.teamCreateForm}
                    on:updated={refreshContest}
                />
            {:catch error}
                <p>{error.message}</p>
            {/await}
        </Container>
    </FullPageCentered>
</Page>
