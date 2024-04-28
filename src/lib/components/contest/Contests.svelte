<script lang="ts">
    import ContestCollection from "$lib/components/contest/ContestCollection.svelte";
    import type { ContestDTO } from "@contestsubmission/api-client";

    export let contests: ContestDTO[];
    export let loaded: boolean = true;
</script>

<div class="w-[80%] m-auto mt-5">
    <ContestCollection contests={contests} {loaded}/>
</div>
