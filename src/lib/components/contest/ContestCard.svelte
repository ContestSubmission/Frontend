<script lang="ts">
    import type { Contest } from "@contestsubmission/api-client/models/Contest";
    import Container from "$lib/components/ui/container/Container.svelte";
    import { Button } from "$lib/components/ui/button";
    import { formatDateAndRelative } from "$lib/date_utils.js";

    export let contest: Contest;
</script>

<Container class="flex flex-col justify-between p-4">
    <div>
        <img class="w-full h-60" src="https://avatars.githubusercontent.com/u/150123956?s=200&v=4" alt={contest.name}>
        <h2 class="text-2xl font-bold">{contest.name}</h2>
        <p class="text-left">ends {formatDateAndRelative(contest.deadline)}</p>
    </div>
    <Button class="w-full mt-2">Go to contest</Button>
</Container>
