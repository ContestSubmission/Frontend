<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import { Resources } from "$lib/client/api_client";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import { page } from "$app/stores";
    import { ensureLoggedIn } from "$lib/auth";
    import { loadingContests } from "$lib/loading_utils";
    import Contests from "$lib/components/contest/Contests.svelte";

    ensureLoggedIn($page);
</script>

<Page pageName="Participations">
    {#if $page.data.session}
        {#await Resources.contest.contestMyGet()}
            <Contests contests={loadingContests} loaded={false}/>
        {:then results}
            {#if results.length === 0}
                <FullPageCentered>
                    <p>No results found</p>
                </FullPageCentered>
            {:else}
                <Contests contests={results} loaded={true}/>
            {/if}
        {:catch error}
            <FullPageCentered>
                <p>Error: {error.message}</p>
            </FullPageCentered>
        {/await}
    {:else}
        <Contests contests={loadingContests} loaded={false}/>
    {/if}
</Page>
