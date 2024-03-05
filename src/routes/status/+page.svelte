<script lang="ts">
    import semver from "semver";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import { Resources } from "$lib/client/api_client";
    import AlertTriangle from "lucide-svelte/icons/alert-triangle";
    import Page from "$lib/components/Page.svelte";

    let clientVersion = semver.parse(rootPackage.dependencies["@contestsubmission/api-client"])!

    let serverVersion = Resources.meta.infoGet();

    function diffColor(diff: semver.ReleaseType | null) {
        switch (diff) {
            case "major": return "text-red-500";
            case "minor": return "text-orange-500";
            case "patch": return "text-yellow-500";
            default: return "text-gray-500";
        }
    }
</script>

<Page pageName="API Compatibility Status">
    <FullPageCentered>
        <Container>
            <H2>Client version</H2>
            <code>{clientVersion}</code>
            {#await serverVersion}
                <H2>Server version</H2>
                <p>Loading...</p>
                <H2>Status</H2>
            {:then info}
                <H2>Server version</H2>
                <code>{info.version}</code>
                <H2>Status</H2>
                {#if semver.eq(clientVersion, info.version)}
                    <p>Your client version is compatible with the server version.</p>
                {:else}
                    <div class="flex items-center">
                        <AlertTriangle class="mr-4 {diffColor(semver.diff(clientVersion, info.version))}"/>
                        <div class="flex flex-col">
                            {#if semver.gt(clientVersion, info.version)}
                                    <p>Client version newer than server version!</p>
                            {:else if semver.lt(clientVersion, info.version)}
                                    <p>Client version older than server version!</p>
                            {/if}
                            <p>Difference:
                                <span class="font-bold {diffColor(semver.diff(clientVersion, info.version))}">
                                    {semver.diff(clientVersion, info.version)}
                                </span>
                            </p>
                        </div>
                    </div>
                {/if}
            {:catch error}
                <p>{error.message}</p>
            {/await}
        </Container>
    </FullPageCentered>
</Page>
