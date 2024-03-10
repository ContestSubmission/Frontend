<script lang="ts">
    import { Dialog, DialogContent, DialogTrigger } from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { formSchema, type FormSchema } from "./create-team-schema";
    import { zodClient } from "sveltekit-superforms/adapters";
    import {
        FormButton,
        FormControl,
        FormDescription,
        FormField,
        FormFieldErrors,
        FormLabel
    } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { createEventDispatcher } from "svelte";

    export let data: SuperValidated<Infer<FormSchema>>;

    const eventDispatcher = createEventDispatcher();

    const form = superForm(data, {
        validators: zodClient(formSchema),
        onSubmit: () => eventDispatcher("updated")
    });

    const { form: formData, enhance } = form;
</script>

<Dialog>
    <DialogTrigger>
        <Button class="w-full">Join this Contest</Button>
    </DialogTrigger>
    If you want to join this contest, click here to set your team up!
    <DialogContent>
        <form method="POST" action="?/teamCreate" use:enhance>
            <FormField {form} name="name">
                <FormControl let:attrs>
                    <FormLabel>Team name</FormLabel>
                    <Input {...attrs} bind:value={$formData.name}/>
                </FormControl>
                <FormDescription>What should your team be called?</FormDescription>
                <FormFieldErrors/>
            </FormField>
            <FormButton>Create!</FormButton>
        </form>
    </DialogContent>
</Dialog>
