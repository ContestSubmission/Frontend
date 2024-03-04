<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { signIn } from "@auth/sveltekit/client";
    import Page from "$lib/components/Page.svelte";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import type { MyUser } from "$lib/auth";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

    if (browser && $page.data.session?.user == null) {
        signIn("oidc");
    }

    let user: MyUser | null = $page.data.session?.user ?? null;
</script>

<style>
    :global(.super-debug) {
        text-align: left;
        padding-right: 1em;
    }
</style>

<Page pageName="User">
    <FullPageCentered>
        <Container class="flex flex-row gap-8 p-4">
            {#if user}
                <img src={user.image} alt="Profile picture of {user.displayName}"/>
                <div>
                    <H2>{user.name}</H2>
                    <SuperDebug data={user} stringTruncate={50}/>
                </div>
            {:else}
                <p>Loading...</p>
            {/if}
        </Container>
    </FullPageCentered>
</Page>
