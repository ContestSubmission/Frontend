<script lang="ts">
    import { cn } from "$lib/utils";

    export let loaded: boolean = false;

    let classes = "";
    export { classes as class };

    export let style: string = "";

    export let text: boolean = false;
    $: if (text) {
        style += "transform: scale(0.8)";
    }

    // controls if the content is shown once loading is done
    export let showLoaded = true;
</script>

{#if loaded && showLoaded}
    <slot {...$$restProps}/>
{:else if !loaded}
    <div id="loader"
        {style}
         class={cn("animate-pulse rounded-md bg-foreground text-transparent w-[fit-content] children:opacity-0", classes)}
    >
        <slot />
    </div>
{/if}
