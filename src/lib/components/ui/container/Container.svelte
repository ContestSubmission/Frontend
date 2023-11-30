<script lang="ts">
    let classes: string;
    export { classes as class };

    export let id: string;
</script>

<div class="children:text-center px-8 py-4 rounded bg-card bg-opacity-70 {classes}" {id}>
    <slot/>
</div>
