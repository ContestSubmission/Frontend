<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { MoreHorizontal } from "lucide-svelte";
    import type { uuid } from "$lib/types";
    import type { PersonalContestDTO } from "@contestsubmission/api-client";
    import { isOngoing } from "$lib/contest_utils";
    import {
        DropdownMenu,
        DropdownMenuTrigger,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuContent,
        DropdownMenuGroup
    } from "$lib/components/ui/dropdown-menu";

    export let teamId: uuid;
    export let submissionId: number | null;
    export let contest: PersonalContestDTO;
</script>

<DropdownMenu>
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
        {#if !isOngoing(contest)}
            <DropdownMenuItem>
                Grade
            </DropdownMenuItem>
            <DropdownMenuSeparator />
        {/if}
        <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {#if submissionId !== null}
                <DropdownMenuItem on:click={() => navigator.clipboard.writeText(submissionId.toString())}>
                    Copy submission ID
                </DropdownMenuItem>
            {/if}
            <DropdownMenuItem on:click={() => navigator.clipboard.writeText(teamId)}>
                Copy team ID
            </DropdownMenuItem>
        </DropdownMenuGroup>
    </DropdownMenuContent>
</DropdownMenu>
