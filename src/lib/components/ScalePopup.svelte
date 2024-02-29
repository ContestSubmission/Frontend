<script lang="ts">
    import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
    import RangeSlider from "svelte-range-slider-pips"
    import { getCookie } from "$lib/svelte_utils";
    import { parseInteger } from "$lib/javascript_utils.js";
    import { COOKIE_NAME, MAX_COOKIE_AGE, MAX_SCALE, MIN_SCALE } from "$lib/scale";

    let values = [parseInteger(getCookie("scale")) ?? 100];
</script>

<DialogContent class="px-12">
    <DialogHeader>
        <DialogTitle>Change scale</DialogTitle>
        <DialogDescription>
            <RangeSlider all="label"
                         pips
                         pipstep={20}
                         float
                         bind:values
                         min={MIN_SCALE}
                         step={1}
                         max={MAX_SCALE}
                         formatter={value => {
                             if (value > MAX_SCALE - 20) return "schasaugert";
                             return `${value}%`;
                         }}
                         on:change={e => {
                             document.documentElement.style.fontSize = e.detail.values[0] + "%";
                             // never expiring cookie
                             document.cookie = `${COOKIE_NAME}=${e.detail.values[0]}; max-age=${MAX_COOKIE_AGE}`;
                         }}
            />
        </DialogDescription>
    </DialogHeader>
</DialogContent>
