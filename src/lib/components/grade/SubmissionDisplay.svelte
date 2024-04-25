<script lang="ts">
    import type { Submission } from "@contestsubmission/api-client";
    import { isSupported } from "$lib/submission_utils";

    export let submission: Submission;
    let type = submission.contentType;
    let url = submission.url!;
    let fileName = submission.fileName!;
</script>

{#if type === undefined || type === null}
    Submission too old. Cannot display preview.
{:else if type.startsWith("image")}
    <img src={url} alt={fileName}/>
{:else if type.endsWith("application/pdf")}
    <embed src={url} type="application/pdf" class="w-full h-full">
{:else if isSupported(type)}
    This should be supported, but isn't. Please report this!
{/if}
