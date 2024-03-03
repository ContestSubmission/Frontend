<script lang="ts">
    import type { FormSchema } from "./upload-schema.js";
    import { formSchema } from "./upload-schema.js";
    import { Form, FormButton, FormField, FormInput, FormItem, FormValidation } from "$lib/components/ui/form/index.js";
    import A from "$lib/components/utils/typography/A.svelte";
    import type { PersonalContestDTO, PreSignedPost, Submission } from "@contestsubmission/api-client";
    import { Resources, responseErrorHandler } from "$lib/client/api_client.js";
    import type { SuperValidated } from "sveltekit-superforms";
    import type { FormOptions } from "formsnap";

    let state: "idle" | "uploading" | "submitting" | "success" | "error" = "idle";
    let file: File | null = null;
    let uploadedUrl: string | null = null;

    export let contest: PersonalContestDTO;

    export let lastSubmission: Submission | null;

    function handleChange(event: Event) {
        file = event.target!.files[0]
    }

    async function handleSubmit() {
        state = "uploading";
        // copy or something
        const fileToUpload = file!;
        const preSignedPost: PreSignedPost | null = await Resources.submission.contestContestIdSubmissionTeamIdGetPresignedUrlGet({
            contestId: contest.id,
            teamId: contest.team!.id!,
            fileName: fileToUpload.name
        }).catch(responseErrorHandler);
        if (preSignedPost == null) {
            state = "error";
            return;
        }

        const formData = new FormData();
        Object.entries(preSignedPost.conditions).forEach(([k, v]) => {
            formData.append(k, v);
        });
        formData.append("file", fileToUpload);

        await fetch(preSignedPost.url, {
            method: "POST",
            body: formData
        });
        state = "submitting";

        let url = preSignedPost.url + "/" + preSignedPost.conditions.key;
        let submission: Submission | null = await Resources.submission.contestContestIdSubmissionTeamIdSubmitPost({
            contestId: contest.id,
            teamId: contest.team!.id!,
            handInSubmissionDTO: {
                jwt: preSignedPost.jwt,
                url: url
            }
        }).catch(responseErrorHandler);
        if (submission == null) {
            state = "error";
            return;
        }
        state = "success";
        uploadedUrl = url;
        lastSubmission = submission;
    }

    export let form: SuperValidated<FormSchema>;

    const options: FormOptions<typeof formSchema> = {
        onSubmit: handleSubmit
    }
</script>

<Form {options} {form} schema={formSchema} let:config enctype="multipart/form-data" class="flex flex-row w-full gap-2">
    <FormField {config} name="file">
        <FormItem class="w-full">
            <FormInput type="file" on:change={handleChange}/>
            <FormValidation class="mt-0 pt-0 text-red-500"/>
        </FormItem>
    </FormField>
    <FormButton disabled={state === "uploading" || state === "submitting"}>
        Upload
    </FormButton>
</Form>
{#if state !== "idle"}
    <p class="text-center">
        {#if state === "uploading"}
            Uploading...
        {:else if state === "submitting"}
            Submitting...
        {:else if state === "success"}
            Success! <A href={uploadedUrl}>View uploaded file</A>
        {:else if state === "error"}
            Error!
        {/if}
    </p>
{/if}
