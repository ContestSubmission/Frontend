<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import MoreHorizontal from "lucide-svelte/icons/more-horizontal";
    import type { GradeTeamOverviewDTO, PersonalContestDTO } from "@contestsubmission/api-client";
    import { isOngoing } from "$lib/contest_utils";
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuGroup,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger
    } from "$lib/components/ui/dropdown-menu";
    import { Dialog, DialogTrigger } from "$lib/components/ui/dialog";
    import GradingPopup from "./GradingPopup.svelte";
    import type { Infer, SuperValidated } from "sveltekit-superforms";
    import type { FormSchema } from "./schema";

    export let contest: PersonalContestDTO;
    export let grading: GradeTeamOverviewDTO;
    export let gradingForm: SuperValidated<Infer<FormSchema>>;

    let submissionId: number | null = grading.submission?.id ?? null;

    let gradeDialogOpen = false;

    // noinspection JSIncompatibleTypesComparison this is just a blatant lie
    let hasSubmission = grading.submission !== null && submissionId !== null;
</script>

<Dialog bind:open={gradeDialogOpen}>
    <DropdownMenu disableFocusFirstItem={true}>
        <DropdownMenuTrigger asChild let:builder>
            <Button
                variant="ghost"
                builders={[builder]}
                size="icon"
                class="relative h-8 w-8 p-0"
            >
                <span class="sr-only">Open menu</span>
                <MoreHorizontal class="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            {#if !isOngoing(contest) && hasSubmission}
                    <DialogTrigger class="w-full">
                        <DropdownMenuItem>
                            Grade
                        </DropdownMenuItem>
                    </DialogTrigger>
                <DropdownMenuSeparator />
            {/if}
            <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {#if hasSubmission}
                    <DropdownMenuItem on:click={() => navigator.clipboard.writeText(submissionId.toString())}>
                        Copy submission ID
                    </DropdownMenuItem>
                {/if}
                <DropdownMenuItem on:click={() => navigator.clipboard.writeText(grading.team.id)}>
                    Copy team ID
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
    <GradingPopup contestId={contest.id} {grading} bind:open={gradeDialogOpen} data={gradingForm} on:update/>
</Dialog>
