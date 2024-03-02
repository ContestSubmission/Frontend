<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { buttonNameBuilder } from "$lib/svelte_utils.js";

	export let buttonName: string = "";
    export let href: string = "";
</script>

<Button variant="secondary" class="w-10 h-10 p-2" {href} builders={[buttonNameBuilder(buttonName)]}>
    <slot/>
</Button>
