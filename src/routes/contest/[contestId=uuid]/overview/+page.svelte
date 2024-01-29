<script lang="ts">
    import Page from "../../../Page.svelte";
    import { page } from "$app/stores";
    import { Resources } from "$lib/client/api_client.js";
    import type { Contest, Team } from "@contestsubmission/api-client";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import type { SuperValidated } from "sveltekit-superforms";
    import { formSchema, type FormSchema } from "./upload-schema";
    import type { FormOptions } from "formsnap";
    import { Form, FormButton, FormItem, FormField, FormInput, FormValidation } from "$lib/components/ui/form";
    import A from "$lib/components/utils/typography/A.svelte";

    const contestId = $page.params.contestId;

    let contestData: Contest | null;
    let myTeam: Team | null = null;
    const contest = Resources.contest.contestIdPersonalGet({ id: contestId })
        .then(data => {
            contestData = data;
            myTeam = data.team;
            return data;
        });

    let state: "idle" | "uploading" | "submitting" | "success" | "error" = "idle";
    let file: File | null = null;
    let uploadedUrl: string | null = null;

    function handleChange(event: Event) {
        file = event.target!.files[0]
    }

    async function handleSubmit() {
        state = "uploading";
        // copy or something
        const fileToUpload = file!;
        const preSignedPost = await Resources.submission.contestContestIdSubmissionTeamIdGetPresignedUrlGet({
            contestId: contestId,
            teamId: myTeam!.id!,
            fileName: fileToUpload.name
        });

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
        await Resources.submission.contestContestIdSubmissionTeamIdSubmitPost({
            contestId: contestId,
            teamId: myTeam!.id!,
            handInSubmissionDTO: {
                jwt: preSignedPost.jwt,
                url: url
            }
        });
        state = "success";
        uploadedUrl = url;
    }

    export let form: SuperValidated<FormSchema>;

    const options: FormOptions<typeof formSchema> = {
        onSubmit: handleSubmit
    }
</script>

<Page pageName={contestData?.name ?? "Contest loading..."}>
    <FullPageCentered>
        <Container class="flex flex-col justify-between p-4">
            {#await contest}
                <p>Loading...</p>
            {:then contest}
                <H1>{contest.name}</H1>
                <p>{contest.description}</p>
                {#if contest.team != null}
                    <p class="pt-2">Your team: {contest.team.name}</p>
                    <div class="pt-2 grid w-full max-w-sm items-center gap-1.5">
                        <Form {options} {form} schema={formSchema} let:config>
                            <FormField {config} name="file">
                                <FormItem>
                                    <FormInput type="file" on:change={handleChange} />
                                    <FormValidation class="mt-0 pt-0 text-red-500"/>
                                </FormItem>
                            </FormField>
                            <FormButton class="mt-2">
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
                    </div>
                {/if}
            {:catch error}
                <p>{error.message}</p>
            {/await}
        </Container>
    </FullPageCentered>
</Page>
