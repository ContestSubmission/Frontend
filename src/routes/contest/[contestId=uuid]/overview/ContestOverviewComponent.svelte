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
    import type { Infer, SuperValidated } from "sveltekit-superforms";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";

    export let contest: PersonalContestDTO;

    export let uploadForm: SuperValidated<Infer<FormSchema>>

    export let lastSubmission: Submission | null;

    const teamPageShown = contest.team != null;
    const uploadShown = teamPageShown && isOngoing(contest);
</script>


<H1>{contest.name}</H1>
<p class="text-sm">ends {formatDateAndRelative(contest.deadline, $time)}</p>
{#if contest.description}
    <p class="p-0 m-0">{contest.description}</p>
{/if}
<div class="gap-2 flex flex-col mt-4">
    {#if contest.publicGrading || contest.organizer.id === $page.data?.session?.user.id}
        <Button href="grade">View submissions</Button>
    {/if}
    {#if contest.organizer.id === $page.data?.session?.user.id && isOngoing(contest)}
        <EndNowButton contestId={contest.id} on:ended/>
    {/if}
    {#if contest.team != null}
        <Tabs>
            <TabsList class="w-full">
                {#if teamPageShown}
                    <TabsTrigger value="team" class="w-full data-[state=active]:bg-accent">Team management</TabsTrigger>
                {/if}
                {#if uploadShown}
                    <TabsTrigger value="upload" class="w-full data-[state=active]:bg-accent">Upload</TabsTrigger>
                {/if}
            </TabsList>
            <TabsContent value="team">
                {#if teamPageShown}
                    <div class="flex flex-col gap-2">
                        <p>Your team: {contest.team.name}</p>
                        {#if contest.team.owner.id === $page.data?.session?.user.id}
                            <InviteComponent {contest}/>
                        {/if}
                    </div>
                {/if}
            </TabsContent>
            <TabsContent value="upload">
                <div class="pt-2 grid w-full items-center gap-1.5">
                    {#if isOngoing(contest)}
                        <UploadComponent {contest} bind:lastSubmission data={uploadForm}/>
                    {/if}
                    {#if lastSubmission != null && lastSubmission.url}
                        <A href={lastSubmission.url}>Existing submission (#{lastSubmission.id})</A>
                    {/if}
                </div>
            </TabsContent>
        </Tabs>
    {/if}
</div>
