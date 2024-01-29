<script lang="ts">
    import Page from "../Page.svelte";
    import { Resources } from "$lib/client/api_client";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import { Stretch } from "svelte-loading-spinners";
    import colors from "tailwindcss/colors";
    import ContestCollection from "$lib/components/contest/ContestCollection.svelte";
    import { page } from "$app/stores";
    import type { ParticipatedContestDTO } from "@contestsubmission/api-client/models/ParticipatedContestDTO";

    let data: Promise<ParticipatedContestDTO[]> = Resources.contest.contestMyGet()
</script>

<Page pageName="Participations">
    {#if $page.data.session}
        {#await data}
            <FullPageCentered>
                <Stretch color={colors.slate['100']}/>
            </FullPageCentered>
        {:then results}
            {#if results.length === 0}
                <FullPageCentered>
                    <p>No results found</p>
                </FullPageCentered>
            {:else}
                <div class="w-[80%] m-auto mt-5">
                    <ContestCollection contests={results}/>
                </div>
            {/if}
        {:catch error}
            <FullPageCentered>
                <p>Error: {error.message}</p>
            </FullPageCentered>
        {/await}
    {:else}
        <FullPageCentered>
            <p>You need to be logged in to see this page</p>
        </FullPageCentered>
    {/if}
</Page>
