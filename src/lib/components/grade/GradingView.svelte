<script>
    import GradingTable from "./GradingTable.svelte";
    import { ViewMode } from "./grade";
    import GradingGrid from "./GradingGrid.svelte";

    export let data;
    export let contest;
    export let gradingForm;
    export let mode;
</script>

{#if mode === ViewMode.TABLE}
    <GradingTable
            {data}
            {contest}
            {gradingForm}
    />
{:else if mode === ViewMode.GRID}
    <GradingGrid {data} {contest} {gradingForm}/>
{/if}
