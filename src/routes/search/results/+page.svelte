<script lang="ts">
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import { pageName } from "$lib/page_props";
    import { afterNavigate } from "$app/navigation";
    import SearchForm from "./SearchForm.svelte";
    import type { PageData } from "./$types";
    import Page from "../../Page.svelte";
    import { page } from "$app/stores";
    import { Stretch } from "svelte-loading-spinners";
    import colors from "tailwindcss/colors";
    import ContestCollection from "$lib/components/contest/ContestCollection.svelte";


    function setPageName() {
        pageName.set("Contest search results");
    }

    afterNavigate(setPageName);
    setPageName();

    export let data: PageData;
</script>

<Page>
    <!-- negative z-index to allow clicks to navbar -->
    {#await data.streamed.results}
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

    <svelte:fragment slot="navbar-left">
        <SearchForm form={data.form} defaultValue={$page.url.searchParams.get("term")}/>
    </svelte:fragment>
</Page>
