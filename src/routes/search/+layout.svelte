<script lang="ts">
    import { onMount } from "svelte";
    import {pageName} from "$lib/page_props";

    onMount(() => pageName.set("Search Contest"));
</script>
