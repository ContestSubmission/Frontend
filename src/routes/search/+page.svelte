<script lang="ts">
    import { pageName } from "$lib/page_props";
    import { afterNavigate } from "$app/navigation";
    import type { PageData } from "./$types";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import SearchForm from "./SearchForm.svelte";
    import Page from "../Page.svelte";

    function setPageName() {
        pageName.set("Search Contest");
    }

    afterNavigate(setPageName);
    setPageName();

    export let data: PageData;
</script>

<Page>
    <!-- negative z-index to allow clicks to navbar -->
    <FullPageCentered class="flex justify-center gap-3 -z-10">
        <H1>Find your next Contest</H1>
        <SearchForm form="{data.form}"/>
    </FullPageCentered>
</Page>
