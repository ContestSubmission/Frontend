<script lang="ts">
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import {pageName} from "$lib/page_props";
    import {afterNavigate} from "$app/navigation";
    import SearchForm from "./SearchForm.svelte";
    import type {PageData} from "./$types";
    import Page from "../../Page.svelte";
    import {page} from "$app/stores";


    function setPageName() {
        pageName.set("Contest search results");
    }

    afterNavigate(setPageName)
    setPageName();

    export let data: PageData;
    console.log($page.params)
</script>

<Page>
    <!-- negative z-index to allow clicks to navbar -->
    <FullPageCentered class="flex justify-center gap-3 -z-10">
        <H1>Find your next Contest!</H1>
    </FullPageCentered>

    <svelte:fragment slot="navbar-left">
        <SearchForm form={data.form} defaultValue={$page.url.searchParams.get("term")}/>
    </svelte:fragment>
</Page>
