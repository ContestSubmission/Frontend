<script lang="ts">
    import { formatDateAndRelative, time } from "$lib/date_utils.js";
    import { page } from "$app/stores";
    import { isOngoing } from "$lib/contest_utils.js";
    import { type FormSchema as UploadFormSchema } from "./submission/upload-submission-schema";
    import { type FormSchema as TeamCreateFormSchema } from "./team/create-team-schema";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import InviteComponent from "./team/InviteComponent.svelte";
    import EndNowButton from "./EndNowButton.svelte";
    import A from "$lib/components/utils/typography/A.svelte";
    import { type PersonalContestDTO, type Submission } from "@contestsubmission/api-client";
    import UploadComponent from "./submission/UploadComponent.svelte";
    import type { Infer, SuperValidated } from "sveltekit-superforms";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
    import TeamCreateComponent from "./team/TeamCreateComponent.svelte";
    import Warning from "$lib/components/Warning.svelte";
    import Loadable from "$lib/components/utils/Loadable.svelte";
    import { buttonStyles } from "$lib/loading_utils";

    export let contest: PersonalContestDTO;

    export let uploadForm: SuperValidated<Infer<UploadFormSchema>>;
    export let teamCreateForm: SuperValidated<Infer<TeamCreateFormSchema>>;

    export let lastSubmission: Submission | null;

    const userId = $page.data?.session?.user.id;
    const isOrganizer = contest.organizer.id === userId;
    const ongoing = isOngoing(contest);

    // either you already have a team or can make one
    const teamPageShown = (contest.team != null || ongoing) && !isOrganizer;
    // you have a team and can still upload something
    const uploadShown = contest.team != null && ongoing;

    export let loaded = true;
</script>


<Loadable {loaded} class="m-auto" text={true}>
    <H1>{contest.name}</H1>
</Loadable>
<Loadable {loaded} class="m-auto" text={true}>
    <p class="text-sm">ends {formatDateAndRelative(contest.deadline, $time)}</p>
</Loadable>
{#if contest.description}
    <Loadable {loaded} class="m-auto" text={true}>
        <p class="p-0 m-0">{contest.description}</p>
    </Loadable>
{/if}
<div class="gap-2 flex flex-col mt-4">
    {#if loaded}
        {#if isOrganizer || contest.publicGrading}
            {#if isOrganizer || !ongoing}
                <Button href="grade">View submissions</Button>
            {:else}
                <Button disabled>View submissions</Button>
                <Warning>Contest is still running, you can't view submissions yet</Warning>
            {/if}
        {/if}
        {#if isOrganizer && ongoing}
            <EndNowButton contestId={contest.id} on:updated />
        {/if}
        {#if teamPageShown || uploadShown}
            <Tabs>
                <TabsList class="w-full mt-8">
                    {#if teamPageShown}
                        <TabsTrigger value="team" class="w-full data-[state=active]:bg-accent">My Team</TabsTrigger>
                    {/if}
                    {#if uploadShown}
                        <TabsTrigger value="upload" class="w-full data-[state=active]:bg-accent">Upload</TabsTrigger>
                    {/if}
                </TabsList>
                <TabsContent value="team">
                    {#if teamPageShown}
                        <div class="flex flex-col gap-2">
                            {#if contest.team != null}
                                <p>Your team: {contest.team.name}</p>
                                {#if contest.team.owner.id === userId && ongoing}
                                    <InviteComponent {contest} />
                                {/if}
                            {:else}
                                <TeamCreateComponent data={teamCreateForm} on:updated />
                            {/if}
                        </div>
                    {/if}
                </TabsContent>
                <TabsContent value="upload">
                    {#if uploadShown}
                        <div class="pt-2 grid w-full items-center gap-1.5">
                            {#if ongoing}
                                <UploadComponent {contest} bind:lastSubmission data={uploadForm} />
                            {/if}
                            {#if lastSubmission != null && lastSubmission.url}
                                <A href={lastSubmission.url}>Existing submission (#{lastSubmission.id})</A>
                            {/if}
                        </div>
                    {/if}
                </TabsContent>
            </Tabs>
        {/if}
    {:else}
        <Loadable class="{buttonStyles(buttonVariants.defaultVariants)} w-full">
            <Button>View submissions</Button>
        </Loadable>
    {/if}
</div>
