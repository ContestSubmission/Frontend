<script lang="ts">
    import { formatDateAndRelative, time } from "$lib/date_utils.js";
    import { page } from "$app/stores";
    import { isOngoing } from "$lib/contest_utils.js";
    import { type FormSchema } from "./upload-schema";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import InviteComponent from "./InviteComponent.svelte";
    import EndNowButton from "./EndNowButton.svelte";
    import A from "$lib/components/utils/typography/A.svelte";
    import { type PersonalContestDTO, type Submission } from "@contestsubmission/api-client";
    import UploadComponent from "./UploadComponent.svelte";
    import type { SuperValidated } from "sveltekit-superforms";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";

    export let contest: PersonalContestDTO;

    export let uploadForm: SuperValidated<FormSchema>

    export let lastSubmission: Submission | null;

    const teamPageShown = contest.team != null;
    const uploadShown = teamPageShown && isOngoing(contest);
</script>


<H1>{contest.name}</H1>
<p class="text-sm">ends {formatDateAndRelative(contest.deadline, $time)}</p>
<!-- will be replaced by RBAC later -->
<div class="gap-4 flex flex-col">
    <p>{contest.description}</p>
    {#if contest.publicGrading || contest.organizer.id === $page.data?.session?.user.id}
        <Button href="grade">View submissions</Button>
    {/if}
    {#if contest.organizer.id === $page.data?.session?.user.id && isOngoing(contest)}
        <EndNowButton contestId={contest.id} on:ended/>
    {/if}
    <Tabs>
        <TabsList>
            {#if teamPageShown}
                <TabsTrigger value="team">Team management</TabsTrigger>
            {/if}
            {#if uploadShown}
                <TabsTrigger value="upload">Upload</TabsTrigger>
            {/if}
        </TabsList>
        <TabsContent value="team">
            <div class="flex flex-col gap-2">
                <p>Your team: {contest.team.name}</p>
                {#if contest.team.owner.id === $page.data?.session?.user.id}
                    <InviteComponent {contest}/>
                {/if}
            </div>
        </TabsContent>
        <TabsContent value="upload">
            <div class="pt-2 grid w-full items-center gap-1.5">
                {#if isOngoing(contest)}
                    <UploadComponent {contest} bind:lastSubmission form={uploadForm}/>
                {/if}
                {#if lastSubmission != null}
                    <A href={lastSubmission.url}>Existing submission (#{lastSubmission.id})</A>
                {/if}
            </div>
        </TabsContent>
    </Tabs>
</div>
