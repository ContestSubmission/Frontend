<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import Plus from "lucide-svelte/icons/plus";
    import Search from "lucide-svelte/icons/search";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import Page from "$lib/components/Page.svelte";
</script>

<svelte:head>
    <style>
        html {
            /* Placeholder, will be replaced by a video */
            background-image: url("https://images.unsplash.com/photo-1516321497487-e288fb19713f");
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            backdrop-filter: blur(0.5em);
            min-height: 100vh;
        }
    </style>
</svelte:head>

<Page pageName="Home" showPageName={false}>
    <!-- negative z-index to allow clicks to navbar -->
    <FullPageCentered class="homepage flex justify-center gap-3 -z-10">
        <Container id="header-box" class="card px-14 py-8 backdrop-blur-lg">
            <H1 class="text-6xl">ContestSubmission</H1>
            <H2 class="text-5xl">Managing contests, but simple.</H2>
        </Container>
        <div class="buttons flex gap-2">
            <Button variant="secondary" href="/search">
                <Search class="mr-2 h-4 w-4"/>
                Search a Contest
            </Button>
            <Button variant="secondary" href="/contest/create">
                <Plus class="mr-2 h-4 w-4"/>
                Create a Contest
            </Button>
        </div>
    </FullPageCentered>
</Page>
