<script lang="ts">
    import { cn } from "$lib/utils";

    let classes: string = "";

    export { classes as class };
</script>

<p class={cn("font-medium text-primary", classes)} {...$$restProps}>
    <slot/>
</p>
