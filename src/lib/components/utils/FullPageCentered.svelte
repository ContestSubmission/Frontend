<style>
    div {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<script lang="ts">
    let classes: string;
    export { classes as class };
</script>

<div class={classes}>
    <slot/>
</div>
