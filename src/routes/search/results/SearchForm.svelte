<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { formSchema, type FormSchema } from "../schema";
    import type { SuperValidated } from "sveltekit-superforms";
    import { Search } from "lucide-svelte";

    export let form: SuperValidated<FormSchema>;

    export let defaultValue: string | undefined | null;
</script>
<Form.Root asChild let:attrs {form} schema={formSchema} let:config>
    <form {...attrs} method="get" action="" class="flex flex-row justify-center items-start w-80">
        <Form.Field {config} name="term">
            <Form.Item>
                <Form.Input class="bg-secondary text-primary-foreground" placeholder="Search term" {defaultValue}/>
                <Form.Validation class="mt-0 pt-0 text-red-500"/>
            </Form.Item>
        </Form.Field>
        <Form.Button class="ml-2">
            <Search class="p-1 mr-1"/>
            Search
        </Form.Button>
    </form>
</Form.Root>
