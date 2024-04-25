<script lang="ts">
    import { HoverCard, HoverCardContent, HoverCardTrigger } from "$lib/components/ui/hover-card";
    import { Dialog, DialogContent, DialogTrigger } from "$lib/components/ui/dialog";
    import SubmissionDisplay from "$lib/components/grade/SubmissionDisplay.svelte";
    import type { Submission } from "@contestsubmission/api-client";
    import { Button } from "$lib/components/ui/button";
    import { isSupported } from "$lib/submission_utils";
    import A from "$lib/components/utils/typography/A.svelte";

    export let submission: Submission;
    export let withPreview: boolean;

    let hoverOpen: boolean
</script>

{#if !isSupported(submission.contentType) && !withPreview}
    <div class="w-full h-full flex justify-center items-center">
        <A href={submission.url} download={submission.fileName} variant="link" target="_blank">
            {submission.fileName}
        </A>
    </div>
    <Button class="w-full" href={submission.url} download={submission.fileName} target="_blank">
        Download
    </Button>
{:else}
    <Dialog onOpenChange={() => hoverOpen = false}>
        {#if withPreview}
            {#if !isSupported(submission.contentType)}
                <slot/>
            {:else}
                <HoverCard bind:open={hoverOpen}>
                    <HoverCardTrigger>
                        <slot/>
                    </HoverCardTrigger>
                    <HoverCardContent>
                        <DialogTrigger>
                            <SubmissionDisplay {submission}/>
                        </DialogTrigger>
                    </HoverCardContent>
                </HoverCard>
            {/if}
        {:else}
            <DialogTrigger class="w-full h-full">
                <SubmissionDisplay {submission}/>
            </DialogTrigger>
            <div class="w-full flex flex-row justify-between">
                <DialogTrigger class="w-[48%]">
                    <Button class="w-full">Preview</Button>
                </DialogTrigger>
                <Button class="w-[48%]" href={submission.url} download={submission.fileName} target="_blank">
                    Download
                </Button>
            </div>
        {/if}
        <DialogContent class="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] flex justify-center items-center">
            <a href={submission.url} download={submission.fileName} class="w-full h-full flex justify-center items-center">
                <SubmissionDisplay {submission}/>
            </a>
        </DialogContent>
    </Dialog>
{/if}
