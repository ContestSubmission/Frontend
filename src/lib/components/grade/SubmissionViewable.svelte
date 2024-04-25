<script lang="ts">
    import { HoverCard, HoverCardContent, HoverCardTrigger } from "$lib/components/ui/hover-card";
    import { Dialog, DialogContent, DialogTrigger } from "$lib/components/ui/dialog";

    export let url: string;
    export let fileName: string;
    export let withPreview: boolean;

    let hoverOpen: boolean
</script>
<Dialog onOpenChange={() => hoverOpen = false}>
    {#if withPreview}
        <HoverCard bind:open={hoverOpen}>
            <HoverCardTrigger>
                <slot/>
            </HoverCardTrigger>
            <HoverCardContent class="max-w-[70vw]">
                <DialogTrigger>
                    <img src={url} alt={fileName}/>
                </DialogTrigger>
            </HoverCardContent>
        </HoverCard>
    {:else}
        <DialogTrigger>
            <img src={url} alt={fileName}/>
        </DialogTrigger>
    {/if}
    <DialogContent>
        <a href={url} download>
            <img src={url} alt={fileName}/>
        </a>
    </DialogContent>
</Dialog>
