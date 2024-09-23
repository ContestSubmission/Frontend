<style>
    div {
        height: 100vh;
        width: 100vw;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: fixed;
        max-height: 80vh;
    }
</style>

<script lang="ts">
    import { twMerge } from "tailwind-merge";

    let classes: string = "";
    export { classes as class };
</script>

<div class={twMerge("-z-10", classes)}>
    <slot/>
</div>
