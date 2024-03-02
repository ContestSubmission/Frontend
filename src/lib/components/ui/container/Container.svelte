<script lang="ts">
    import { twMerge } from "tailwind-merge";

    let classes: string = "";
    export { classes as class };

    export let id: string = "";
</script>

<div class={twMerge("[&:not(text-center)]:text-center bg-background px-8 py-4 rounded backdrop-blur-lg bg-opacity-70", classes)} {id}>
    <slot/>
</div>
