<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import Container from "$lib/components/ui/container/Container.svelte";
    import H1 from "$lib/components/utils/typography/H1.svelte";
    import {
        FormButton,
        FormControl,
        FormDescription,
        FormField,
        FormFieldErrors,
        FormLabel
    } from "$lib/components/ui/form";
    import type { PageData } from "./$types";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { formSchema } from "./schema";
    import { superForm } from "sveltekit-superforms";
    import { Input } from "$lib/components/ui/input";
    import DateTimePicker from "$lib/components/ui/date-time-picker/DateTimePicker.svelte";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import { ensureLoggedIn } from "$lib/auth";
    import { page } from "$app/stores";
    import { continuousValidation } from "$lib/form_utils";

    ensureLoggedIn($page);

    export let data: PageData;

    const form = superForm(data.form, {
        validators: zodClient(formSchema)
    });

    const { form: formData, enhance, validateForm, validate, submitting } = form;
    const validation = continuousValidation(formData, validateForm);

    // workaround to fix errors not appearing
    // that is because the default "blur" event is never actually called
    // as closing is done with javascript
    $: $formData.deadline && validate("deadline")
</script>

<Page pageName="Create Contest">
    <FullPageCentered>
        <Container class="p-8">
            <H1>Create a Contest</H1>
            <p>Let's get this party started, shall we?</p>
            <form method="POST" use:enhance class="text-left mt-5">
                <FormField {form} name="name">
                    <FormControl let:attrs>
                        <FormLabel>Name</FormLabel>
                        <Input {...attrs} bind:value={$formData.name}/>
                    </FormControl>
                    <FormDescription>How should your contest be called?</FormDescription>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="description">
                    <FormControl let:attrs>
                        <FormLabel>Description</FormLabel>
                        <Input {...attrs} bind:value={$formData.description}/>
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <FormField {form} name="deadline">
                    <FormControl let:attrs>
                        <FormLabel>Deadline</FormLabel>
                        <DateTimePicker {...attrs} bind:value={$formData.deadline} futureOnly/>
                        <input name={attrs.name} bind:value={$formData.deadline} hidden/>
                    </FormControl>
                    <FormFieldErrors/>
                </FormField>
                <div class="mt-4 space-y-2">
                    <FormField {form} name="publicAccessible" class="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl let:attrs>
                            <Checkbox {...attrs} bind:checked={$formData.publicAccessible}/>
                            <div class="space-y-1 leading-none">
                                <FormLabel>Public</FormLabel>
                                <FormDescription>If enabled, everyone can see and join</FormDescription>
                            </div>
                            <input name={attrs.name} bind:value={$formData.publicAccessible} hidden/>
                        </FormControl>
                        <FormFieldErrors/>
                    </FormField>
                    <FormField {form} name="publicGrading" class="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl let:attrs>
                            <Checkbox {...attrs} bind:checked={$formData.publicGrading}/>
                            <div class="space-y-1 leading-none">
                                <FormLabel>Public Grading</FormLabel>
                                <FormDescription>If enabled, everyone (with an account) can grade submissions
                                </FormDescription>
                            </div>
                            <input name={attrs.name} bind:value={$formData.publicGrading} hidden/>
                        </FormControl>
                        <FormFieldErrors/>
                    </FormField>
                    <FormButton class="w-full" disabled={!$validation?.valid || $submitting}>Create my Contest!</FormButton>
                </div>
            </form>
        </Container>
    </FullPageCentered>
</Page>
