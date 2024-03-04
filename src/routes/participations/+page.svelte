<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import { Resources } from "$lib/client/api_client";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import { Stretch } from "svelte-loading-spinners";
    import colors from "tailwindcss/colors";
    import ContestCollection from "$lib/components/contest/ContestCollection.svelte";
    import { page } from "$app/stores";
    import { ensureLoggedIn } from "$lib/auth";

    ensureLoggedIn($page);
</script>

<Page pageName="Participations">
    {#if $page.data.session}
        {#await Resources.contest.contestMyGet()}
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
            <Stretch color={colors.slate['100']}/>
        </FullPageCentered>
    {/if}
</Page>
