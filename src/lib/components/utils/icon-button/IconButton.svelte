<script lang="ts">
    import { buttonNameBuilder } from "$lib/svelte_utils.js";
    import { Button } from "$lib/components/ui/button";
    import type { Props, Events } from ".";

    type $$Props = Props;
    type $$Events = Events;

    export let buttonName: $$Props["buttonName"];
    export let href: $$Props["href"];
</script>

<Button variant="secondary" class="w-10 h-10 p-2" {href} builders={[buttonNameBuilder(buttonName)]} {...$$restProps}>
    <slot classes={"w-6 h-6"}/>
</Button>
