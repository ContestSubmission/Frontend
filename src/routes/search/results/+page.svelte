<script lang="ts">
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import SearchForm from "../SearchForm.svelte";
    import type { PageData } from "./$types";
    import Page from "$lib/components/Page.svelte";
    import { page } from "$app/stores";
    import { loadingContests } from "$lib/loading_utils";
    import Contests from "$lib/components/contest/Contests.svelte";

    export let data: PageData;
</script>

<Page pageName="Search results" showPageName={false}>
    <!-- negative z-index to allow clicks to navbar -->
    {#await data.streamed.results}
        <Contests loaded={false} contests={loadingContests}/>
    {:then results}
        {#if results.length === 0}
            <FullPageCentered>
                <p>No results found</p>
            </FullPageCentered>
        {:else}
            <Contests contests={results}/>
        {/if}
    {:catch error}
        <FullPageCentered>
            <p>Error: {error.message}</p>
        </FullPageCentered>
    {/await}

    <svelte:fragment slot="navbar-left">
        <SearchForm data={data.form} defaultValue={$page.url.searchParams.get("term")}/>
    </svelte:fragment>
</Page>
