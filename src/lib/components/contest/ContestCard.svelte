<script lang="ts">

    import Container from "$lib/components/ui/container/Container.svelte";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { formatDateAndRelative, time } from "$lib/date_utils";
    import Loadable from "$lib/components/utils/Loadable.svelte";
    import type { Contest } from "@contestsubmission/api-client";
    import { buttonStyles } from "$lib/loading_utils";

    export let contest: Contest;
    export let loaded: boolean = true;
</script>

<Container class="flex flex-col justify-between p-4">
    <div>
        <Loadable {loaded} class="w-full">
            <img class="w-full h-60" src="https://avatars.githubusercontent.com/u/150123956?s=200&v=4" alt={contest.name}>
        </Loadable>
        <Loadable {loaded} class="m-auto" style="transform: scale(0.8)">
            <h2 class="text-2xl font-bold">{contest.name}</h2>
        </Loadable>
        <Loadable {loaded}>
            <p class="text-left">ends {formatDateAndRelative(contest.deadline, $time)}</p>
        </Loadable>
    </div>
    <Loadable {loaded}
              class="w-full mt-2 {buttonStyles(buttonVariants.defaultVariants)}"
    >
        <Button class="w-full mt-2" href="/contest/{contest.id}/overview">
            {#if contest.manager}
                Manage contest
            {:else}
                Go to contest
            {/if}
        </Button>
    </Loadable>
</Container>
