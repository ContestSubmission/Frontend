<script lang="ts">
    import type { GradeTeamOverviewDTO, PersonalContestDTO } from "@contestsubmission/api-client";
    import { type Writable } from "svelte/store";
    import type { Infer, SuperValidated } from "sveltekit-superforms";
    import type { FormSchema } from "./schema";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
    import GradingDropDown from "./GradingDropDown.svelte";
    import { Resources } from "$lib/client/api_client";

    export let contest: PersonalContestDTO;

    export let data: Writable<GradeTeamOverviewDTO[]>

    export let gradingForm: SuperValidated<Infer<FormSchema>>;

    async function updateGradeList() {
        let val = await Resources.grade.contestContestIdGradeListGet({ contestId: contest.id });
        data.set(val);
    }
</script>

<style>
    .parent {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
    }
</style>

<div class="w-full gap-5 m-auto parent">
    {#each $data as entry}
        <Card class="w-full">
            <CardHeader class="relative">
                <GradingDropDown on:update={updateGradeList}
                                 triggerClass="absolute right-6"
                                 {contest}
                                 grading={entry}
                                 {gradingForm}/>

                <CardTitle>{entry.team.name}</CardTitle>
                <CardDescription>
                    {#if entry.scoreCount}
                        {entry.score} ({entry.scoreCount})
                    {:else}
                        No score yet.
                    {/if}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {#if entry.submission}
                    <img class="block w-full" src={entry.submission.url} alt={entry.submission.fileName}/>
                {:else}
                    No submission.
                {/if}
            </CardContent>
        </Card>
    {/each}
</div>
