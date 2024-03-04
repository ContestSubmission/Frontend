<script lang="ts">
    import { formSchema, type FormSchema } from "./schema";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import Search from "lucide-svelte/icons/search";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { Input } from "$lib/components/ui/input";
    import { FormButton, FormControl, FormField } from "$lib/components/ui/form";
    import { cn } from "$lib/utils";

    export let data: SuperValidated<Infer<FormSchema>>;

    const form = superForm(data, {
        validators: zodClient(formSchema)
    });

    const {form: formData} = form;

    export let defaultValue: string | undefined | null = null;
    $: if (defaultValue) $formData.term = defaultValue;

    let classes: string = "";
    export { classes as class };
</script>

<form method="get" action="/search/results" class={cn("flex gap-2 flex-row justify-center items-start w-80", classes)}>
    <FormField {form} name="term">
        <FormControl let:attrs>
            <Input
                    class="text-primary-foreground bg-background"
                    placeholder="Search term"
                    {...attrs}
                    bind:value={$formData.term}
            />
        </FormControl>
    </FormField>
    <FormButton>
        <Search class="p-1 mr-1"/>
        Search
    </FormButton>
</form>
