<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import { page } from "$app/stores";
    import { Resources, responseErrorHandler } from "$lib/client/api_client.js";
    import type { PersonalContestDTO, PreSignedPost, Submission } from "@contestsubmission/api-client";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import type { SuperValidated } from "sveltekit-superforms";
    import { formSchema, type FormSchema } from "./upload-schema";
    import type { FormOptions } from "formsnap";
    import { Form, FormButton, FormField, FormInput, FormItem, FormValidation } from "$lib/components/ui/form";
    import A from "$lib/components/utils/typography/A.svelte";
    import { toast } from "svelte-sonner";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Button } from "$lib/components/ui/button";
    import { clearContestCache, contestCache, loadContest, mayResolve } from "$lib/contest_cache";
    import EndNowButton from "./EndNowButton.svelte";
    import { isOngoing } from "$lib/contest_utils";
    import { formatDateAndRelative } from "$lib/date_utils.js";

    const contestId = $page.params.contestId;

    let contestData: PersonalContestDTO | null;

    async function retrieveContest() {
        clearContestCache(contestId);
        let contest = await mayResolve($contestCache[contestId])
            ?? await loadContest(contestId, $contestCache);

        contestData = contest;
        lastSubmission = contest.submissions?.reduce((prev, curr) => {
            if (prev == null) return curr;
            if (curr.handedInAt > prev.handedInAt) return curr;
            return prev;
        }, null) ?? null;

        return contest;
    }

    let contestPromise: Promise<PersonalContestDTO> = retrieveContest();

    let state: "idle" | "uploading" | "submitting" | "success" | "error" = "idle";
    let file: File | null = null;
    let uploadedUrl: string | null = null;

    let lastSubmission: Submission |  null;

    function handleChange(event: Event) {
        file = event.target!.files[0]
    }

    async function handleSubmit() {
        state = "uploading";
        // copy or something
        const fileToUpload = file!;
        const preSignedPost: PreSignedPost | null = await Resources.submission.contestContestIdSubmissionTeamIdGetPresignedUrlGet({
            contestId: contestId,
            teamId: contestData.team!.id!,
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
            contestId: contestId,
            teamId: contestData.team!.id!,
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

    onMount(() => {
        if (browser && $page.data.fromInvite) {
            toast.success("Joined Contest", {
                description: "Successfully joined this contest. Good luck!",
                duration: Number.POSITIVE_INFINITY,
                classes: {
                    toast: "bg-secondary"
                }
            });

            // remove the fromInvite flag from the URL
            // this is done to prevent the toast from showing again if the user refreshes the page
            let query = new URLSearchParams($page.url.searchParams.toString());
            query.delete("fromInvite");
            goto("?" + query.toString(), { replaceState: true });
        }
    });
</script>

<Page pageName="Contest overview">
    <FullPageCentered>
        <Container class="flex flex-col justify-between p-4">
            {#await contestPromise}
                <p>Loading...</p>
            {:then contest}
                <H1>{contest.name}</H1>
                <p class="text-sm">ends {formatDateAndRelative(contest.deadline)}</p>
                <!-- will be replaced by RBAC later -->
                <div class="gap-2 flex flex-col">
                    <p>{contest.description}</p>
                    {#if contest.publicGrading || contest.organizer.id === $page.data?.session?.user.id}
                        <Button href="grade">View submissions</Button>
                    {/if}
                    {#if contest.team != null}
                        <p class="pt-2">Your team: {contest.team.name}</p>
                        <div class="pt-2 grid w-full max-w-sm items-center gap-1.5">
                            {#if isOngoing(contest)}
                                <Form {options} {form} schema={formSchema} let:config enctype="multipart/form-data">
                                    <FormField {config} name="file">
                                        <FormItem>
                                            <FormInput type="file" on:change={handleChange} />
                                            <FormValidation class="mt-0 pt-0 text-red-500"/>
                                        </FormItem>
                                    </FormField>
                                    <FormButton class="mt-2" disabled={state === "uploading" || state === "submitting"}>
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
                            {/if}
                            {#if lastSubmission != null}
                                <A href={lastSubmission.url}>Existing submission (#{lastSubmission.id})</A>
                            {/if}
                        </div>
                    {:else if contest.organizer.id === $page.data?.session?.user.id && isOngoing(contest)}
                        <EndNowButton contestId={contest.id} on:ended={() => contestPromise = retrieveContest()}/>
                    {/if}
                </div>
            {:catch error}
                <p>{error.message}</p>
            {/await}
        </Container>
    </FullPageCentered>
</Page>
