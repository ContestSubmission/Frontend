<script lang="ts">
    import { cn } from "$lib/utils";

    let classes: string = "";
    export let href: string;

    export { classes as class };
</script>

<a {href} class={cn("font-medium text-primary underline underline-offset-4", classes)} {...$$restProps}>
    <slot/>
</a>
