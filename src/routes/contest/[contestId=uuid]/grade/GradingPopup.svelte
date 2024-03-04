<script lang="ts">
    import type { GradeTeamOverviewDTO } from "@contestsubmission/api-client";
    import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { formSchema, type FormSchema } from "./schema";
    import { FormButton, FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Resources } from "$lib/client/api_client";
    import type { uuid } from "$lib/types";
    import { Circle } from "svelte-loading-spinners";
    import { createEventDispatcher, onMount } from "svelte";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { Input } from "$lib/components/ui/input";
    import { parseInteger } from "$lib/javascript_utils";

    export let grading: GradeTeamOverviewDTO;

    export let data: SuperValidated<Infer<FormSchema>>;

    export let open: boolean;

    export let contestId: uuid;

    const dispatch = createEventDispatcher();

    onMount(() => {
        // pre-fill form with previous grading, if present
        if (grading.personalGrade) {
            gradeField = grading.personalGrade!.score!;
            commentField = grading.personalGrade!.comment!;
        }
    })

    async function handleSubmit() {
        state = "submitting";
        await Resources.grade.contestContestIdGradeSubmissionIdPost({
            contestId,
            submissionId: grading.submission!.id!,
            gradeCreateDTO: {
                score: $formData.grade,
                comment: $formData.comment
            }
        });
        // notify parent to re-fetch its scores
        dispatch("update");
        open = false;
        state = "idle"
    }

    const form = superForm(data, {
        SPA: true,
        validators: zodClient(formSchema),
        onUpdate: handleSubmit
    })

    const { form: formData, enhance, allErrors } = form;

    let state: "idle" | "submitting" = "idle";

    // these fields are required to initialize the form on open
    let commentField = $formData.comment;
    $: $formData.comment = commentField;
    // `as never` to make the compiler STFU about the type shit
    let gradeField: string = $formData.grade as never as string;
    $: $formData.grade = parseInteger(gradeField) ?? "<invalid>" as never;
</script>

<DialogContent>
    <DialogHeader>
        <DialogTitle>Grade {grading.team.name}'s submission</DialogTitle>
        <DialogDescription>
            <form method="post" use:enhance class="space-y-4">
                <FormField {form} name="grade">
                    <FormControl let:attrs>
                        <FormLabel>Score</FormLabel>
                        <Input type="number" min="0" max="100" {...attrs} bind:value={gradeField}/>
                        <Input type="range" min="0" max="100" {...attrs} class="pb-0" bind:value={gradeField}/>
                    </FormControl>
                    <FormFieldErrors class="mt-0"/>
                </FormField>
                <FormField {form} name="comment">
                    <FormControl let:attrs>
                        <FormLabel>Comment</FormLabel>
                        <Input type="text" {...attrs} bind:value={commentField}/>
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <div class="mt-2 flex flex-row gap-2 items-center">
                    <FormButton disabled={state === "submitting" || $allErrors.length > 0}>
                        Submit
                    </FormButton>
                    {#if state === "submitting"}
                        <Circle size="2" unit="em" color="hsl(var(--primary))"/>
                    {/if}
                </div>
            </form>
        </DialogDescription>
    </DialogHeader>
</DialogContent>
