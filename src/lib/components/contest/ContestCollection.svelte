<script lang="ts">
    import type { ContestDTO } from "@contestsubmission/api-client";
    import ContestCard from "$lib/components/contest/ContestCard.svelte";

    export let contests: ContestDTO[] = [];
    export let loaded: boolean = true;
</script>

<style>
    div {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-gap: 1rem;
    }
</style>

<div>
    {#each contests as contest}
        <ContestCard {contest} {loaded}/>
    {/each}
</div>
