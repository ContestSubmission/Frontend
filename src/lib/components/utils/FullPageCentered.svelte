<style>
    div {
        min-height: 100vh;
        min-width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
    }
</style>

<script lang="ts">
    let classes: string;
    export { classes as class };
</script>

<div class={classes}>
    <slot/>
</div>
