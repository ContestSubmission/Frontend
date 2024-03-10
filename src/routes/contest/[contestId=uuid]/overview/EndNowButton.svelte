<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
        AlertDialog,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger
    } from "$lib/components/ui/alert-dialog";
    import { Resources } from "$lib/client/api_client";
    import { Circle } from "svelte-loading-spinners";
    import { createEventDispatcher } from "svelte";

    export let contestId: string;

    let state: "idle" | "submitting" = "idle";

    const eventDispatcher = createEventDispatcher();

    async function submit() {
        state = "submitting";
        await Resources.contest.contestIdEndNowPut({ id: contestId });
        eventDispatcher("updated");
        state = "idle";
        dialogOpen = false;
    }

    let dialogOpen = false;
</script>

<AlertDialog bind:open={dialogOpen} onOpenChange={() => state = "idle"}>
    <AlertDialogTrigger asChild>
        <Button class="w-full" on:click={() => dialogOpen = true}>End Contest now</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will close the contest prematurely
                and prevent any further submissions.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="items-center">
            {#if state === "submitting"}
                <Circle size="2" unit="em" color="hsl(var(--primary))" />
            {/if}
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button on:click={submit} disabled={state === "submitting"}>Continue</Button>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
