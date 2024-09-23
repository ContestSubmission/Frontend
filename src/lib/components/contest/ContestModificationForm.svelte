<script lang="ts">
    import { intProxy, superForm, type SuperValidated } from "sveltekit-superforms";
    import type { ZodValidation } from "sveltekit-superforms/adapters";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { continuousValidation } from "$lib/form_utils.js";
    import { ALL_VIEW_MODES, displayName } from "$lib/components/grade/grade.js";
    import {
        FormButton,
        FormControl,
        FormDescription,
        FormField,
        FormFieldErrors,
        FormLabel
    } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import DateTimePicker from "$lib/components/ui/date-time-picker/DateTimePicker.svelte";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";
    import { Checkbox } from "$lib/components/ui/checkbox";

    export let formSchema: ZodValidation
    export let inputForm: SuperValidated<typeof formSchema>

    const form = superForm(inputForm, {
        validators: zodClient(formSchema)
    });

    const { form: formData, enhance, validateForm, validate, submitting } = form;
    const validation = continuousValidation(formData, validateForm);
    $: console.log("Form validated to", $validation)

    // workaround to fix errors not appearing
    // that is because the default "blur" event is never actually called
    // as closing is done with javascript
    $: $formData.deadline && validate("deadline")
    const hasDeadline = (formSchema._cached.keys).includes("deadline")

    const teamSizeProxy = intProxy(formData, "maxTeamSize");

    $: selectedViewMode = $formData.defaultViewMode
        ? {
            label: displayName($formData.defaultViewMode),
            value: $formData.defaultViewMode
        }
        : undefined;
</script>

<form method="POST" use:enhance class="text-left mt-5">
    <FormField {form} name="name">
        <FormControl let:attrs>
            <FormLabel>Name</FormLabel>
            <Input {...attrs} bind:value={$formData.name}/>
        </FormControl>
        <FormFieldErrors/>
    </FormField>
    <FormField {form} name="description">
        <FormControl let:attrs>
            <FormLabel>Description</FormLabel>
            <Input {...attrs} bind:value={$formData.description}/>
        </FormControl>
        <FormFieldErrors/>
    </FormField>
    {#if hasDeadline}
        <FormField {form} name="deadline">
            <FormControl let:attrs>
                <FormLabel>Deadline</FormLabel>
                <DateTimePicker {...attrs} initialValue={$formData.deadline} bind:value={$formData.deadline} futureOnly/>
                <input name={attrs.name} bind:value={$formData.deadline} hidden/>
            </FormControl>
            <FormFieldErrors/>
        </FormField>
    {/if}
    <FormField {form} name="maxTeamSize">
        <FormControl let:attrs>
            <FormLabel>Max team size</FormLabel>
            <Input type="number" {...attrs} bind:value={$teamSizeProxy}/>
        </FormControl>
        <FormFieldErrors/>
    </FormField>
    <FormField {form} name="defaultViewMode">
        <FormControl let:attrs>
            <FormLabel>Default View Mode</FormLabel>
            <Select
                    selected={selectedViewMode}
                    onSelectedChange={(v) => {
                              v && ($formData.defaultViewMode = v.value);
                            }}
            >
                <SelectTrigger {...attrs}>
                    <SelectValue placeholder="Select the default view mode" />
                </SelectTrigger>
                <SelectContent>
                    {#each ALL_VIEW_MODES as mode}
                        <SelectItem value={mode} label={displayName(mode)} />
                    {/each}
                </SelectContent>
            </Select>
            <input hidden bind:value={$formData.defaultViewMode} name={attrs.name} />
        </FormControl>
        <FormDescription>Set what view should be shown when grading</FormDescription>
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
        <FormButton class="w-full" disabled={!$validation?.valid || $submitting}><slot/></FormButton>
    </div>
</form>
