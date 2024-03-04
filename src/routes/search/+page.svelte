<script lang="ts">
    import type { PageData } from "./$types";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import SearchForm from "./SearchForm.svelte";
    import Page from "$lib/components/Page.svelte";

    export let data: PageData;
</script>

<Page pageName="Search Contest">
    <!-- negative z-index to allow clicks to navbar -->
    <FullPageCentered class="flex justify-center gap-3 -z-10">
        <H1>Find your next Contest</H1>
        <SearchForm data="{data.form}" class="flex-col children:w-full"/>
    </FullPageCentered>
</Page>
