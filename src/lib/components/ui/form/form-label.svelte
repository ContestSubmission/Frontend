<script lang="ts">
	import type { Label as LabelPrimitive } from "bits-ui";
	import { getFormControl } from "formsnap";
	import { cn } from "$lib/utils";
	import { Label } from "$lib/components/ui/label";

	type $$Props = LabelPrimitive.Props;

	let className: $$Props["class"] = undefined;
	export { className as class };

	const { labelAttrs, attrs } = getFormControl();
</script>

<Label {...$labelAttrs} class={cn("data-[fs-error]:text-destructive", className)} {...$$restProps}>
	{#if $attrs["aria-required"]}
		<span class="text-red-500">*</span>
	{/if}
	<slot {labelAttrs} />
</Label>
