<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { validateEmail } from "$lib/javascript_utils";
    import { Resources } from "$lib/client/api_client";
    import { Label } from "$lib/components/ui/label";
    import type { PersonalContestDTO } from "@contestsubmission/api-client";

    let state: "idle" | "submitting" | "invalid" | "sent" = "idle";

    async function submit() {
        if (!validateEmail(value)) {
            state = "invalid";
            return;
        }
        state = "submitting";

        let result = await Resources.invite.contestIdTeamTeamIdInviteCreatePostRaw({
            email: value,
            contestId: contest.id,
            teamId: contest.team!.id!
        })
        if (result.raw.ok) {
            state = "sent";
        } else {
            state = "invalid";
        }
    }

    export let contest: PersonalContestDTO;

    let value: string;
</script>

<Label class="text-left">Invite a team member</Label>
<div class="flex gap-2">
    <Input bind:value type="email" placeholder="Email" class="w-full" id="email"/>
    <Button on:click={submit} disabled={state === "submitting"}>Send invite</Button>
</div>
{#if state === "sent"}
    <p class="text-green-400">Successfully sent invite!</p>
{:else if state === "submitting"}
    <p class="text-blue-400">Sending...</p>
{:else if state === "invalid"}
    <p class="text-orange-400">Couldn't send mail. Please verify the validity of the address.</p>
{:else if value && !validateEmail(value)}
    <p class="text-yellow-400">Please enter a valid email address.</p>
{/if}
