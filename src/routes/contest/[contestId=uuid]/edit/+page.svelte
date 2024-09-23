<script lang="ts">
    import type { PageData } from "./$types";
    import { formSchema } from "./schema"
    import Page from "$lib/components/Page.svelte";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import ContestModificationForm from "$lib/components/contest/ContestModificationForm.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import { ensureLoggedIn } from "$lib/auth";
    import { page } from "$app/stores";
    import { browser } from "$app/environment";
    import { isOngoing } from "$lib/contest_utils";

    ensureLoggedIn($page, browser)

    export let data: PageData
    const contest = data.contest;

    const schema = formSchema(isOngoing(contest));
</script>

<Page pageName="Edit contest">
    <FullPageCentered>
        <Container class="p-8">
            <H1>Edit {contest.name}</H1>
            <ContestModificationForm inputForm={data.form} formSchema={schema}>
                Save
            </ContestModificationForm>
        </Container>
    </FullPageCentered>
</Page>
