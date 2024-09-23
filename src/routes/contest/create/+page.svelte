<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import type { PageData } from "./$types";
    import { formSchema } from "./schema";
    import { ensureLoggedIn } from "$lib/auth";
    import { page } from "$app/stores";
    import ContestModificationForm from "$lib/components/contest/ContestModificationForm.svelte";
    import { browser } from "$app/environment";

    ensureLoggedIn($page, browser);

    export let data: PageData;
</script>

<Page pageName="Create Contest">
    <FullPageCentered>
        <Container class="p-8">
            <H1>Create a Contest</H1>
            <p>Let's get this party started, shall we?</p>
            <ContestModificationForm formSchema={formSchema} inputForm={data.form}>
                Create my Contest!
            </ContestModificationForm>
        </Container>
    </FullPageCentered>
</Page>
