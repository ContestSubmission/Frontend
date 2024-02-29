<script lang="ts">
    import type { GradeTeamOverviewDTO } from "@contestsubmission/api-client";
    import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
    import type { SuperValidated } from "sveltekit-superforms";
    import { formSchema, type FormSchema } from "./schema";
    import { type FormOptions } from "formsnap";
    import {
        Form,
        FormButton,
        FormField,
        FormInput,
        FormItem,
        FormLabel,
        FormValidation
    } from "$lib/components/ui/form";
    import { Resources } from "$lib/client/api_client";
    import type { uuid } from "$lib/types";
    import { Circle } from "svelte-loading-spinners";
    import { createEventDispatcher, onMount } from "svelte";

    export let grading: GradeTeamOverviewDTO;

    export let form: SuperValidated<FormSchema> & { grade: number; comment: string }

    export let open: boolean;

    export let contestId: uuid;

    const dispatch = createEventDispatcher();

    onMount(() => {
        // pre-fill form with previous grading, if present
        if (grading.personalGrade) {
            form.grade = grading.personalGrade!.score!;
            form.comment = grading.personalGrade!.comment!;
        }
    })

    async function handleSubmit() {
        state = "submitting";
        await Resources.grade.contestContestIdGradeSubmissionIdPost({
            contestId,
            submissionId: grading.submission!.id!,
            gradeCreateDTO: {
                score: form.grade,
                comment: form.comment
            }
        });
        // notify parent to re-fetch its scores
        dispatch("update");
        open = false;
        state = "idle"
    }

    const options: FormOptions<typeof formSchema> = {
        onSubmit: handleSubmit
    };

    let state: "idle" | "submitting" = "idle";
</script>

<DialogContent>
    <DialogHeader>
        <DialogTitle>Grade {grading.team.name}'s submission</DialogTitle>
        <DialogDescription>
            <Form {options} {form} schema={formSchema} let:config>
                <FormField {config} name="grade">
                    <FormLabel>Score</FormLabel>
                    <FormItem>
                        <FormInput type="number" min="0" max="100" value="50"/>
                        <FormValidation class="mt-0 pt-0 text-red-500"/>
                    </FormItem>
                    <FormItem>
                        <FormInput type="range" min="0" max="100"/>
                        <FormValidation class="mt-0 pt-0 text-red-500"/>
                    </FormItem>
                </FormField>
                <FormField {config} name="comment">
                    <FormLabel>Comment</FormLabel>
                    <FormItem>
                        <FormInput type="text"/>
                        <FormValidation class="mt-0 pt-0 text-red-500"/>
                    </FormItem>
                </FormField>
                <div class="mt-2 flex flex-row gap-2 items-center">
                    <FormButton disabled={state === "submitting"} type="submit">
                        Submit
                    </FormButton>
                    {#if state === "submitting"}
                        <Circle size="2" unit="em" color="hsl(var(--primary))"/>
                    {/if}
                </div>
            </Form>
        </DialogDescription>
    </DialogHeader>
</DialogContent>
