<script lang="ts">
    import CalendarIcon from "lucide-svelte/icons/calendar";
    import { type DateValue, getLocalTimeZone, now, today } from "@internationalized/date";
    import { cn } from "$lib/utils";
    import { Button } from "$lib/components/ui/button";
    import { Calendar } from "$lib/components/ui/calendar";
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import { parseInteger } from "$lib/javascript_utils";
    import { FieldErrors } from "$lib/components/ui/form";
    import { formatDateAndRelative, time } from "$lib/date_utils";

    let date: DateValue | undefined = undefined;

    export let value: Date | undefined | null = undefined;
    let firstRun = true;

    export let futureOnly: boolean = false;

    function computeDate(date: DateValue | undefined, minutes: number | string, hours: number | string) {
        const result = date?.toDate(getLocalTimeZone());
        if (hours === 0 && minutes == 0) return result;

        if ((parseInteger(hours as string) == null) || parseInteger(minutes as string) == null) {
            return null;
        }

        hours = hours as number;
        minutes = minutes as number;

        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return null;
        }

        if (!result) {
            // first run doesn't show an error
            if (firstRun) {
                firstRun = false;
                return undefined;
            } else {
                return null;
            }
        }

        result.setHours(hours);
        result.setMinutes(minutes);
        return result;
    }

    $: value = computeDate(date, minutes as string, hours as string);

    const items = [
        { value: 1, label: "Tomorrow" },
        { value: 7, label: "In a week" },
        { value: 30, label: "In 30 days" }
    ];

    let hours: string | number = 12;
    let hoursBorder = errorBorder(hours, 0, 23);
    $: hoursBorder = errorBorder(hours, 0, 23);
    let minutes: string | number = 0;
    let minutesBorder = errorBorder(minutes, 0, 59);
    $: minutesBorder = errorBorder(minutes, 0, 59);

    function errorBorder(input: string | undefined | number, min: number, max: number) {
        const int = parseInteger(input as string | undefined);
        if (int == undefined || int < min || int > max) {
            return "border-destructive";
        }
        return "";
    }
</script>

<Popover openFocus>
    <PopoverTrigger asChild let:builder>
        <Button
            variant="outline"
            class={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
            )}
            builders={[builder]}
        >
            <CalendarIcon class="mr-2 h-4 w-4" />
            {value ? formatDateAndRelative(value, $time) : "Pick a date"}
        </Button>
    </PopoverTrigger>
    <PopoverContent class="flex w-auto flex-col space-y-2 p-2">
        <Select
            {items}
            onSelectedChange={(v) => {
                if (!v) return;
                date = today(getLocalTimeZone()).add({ days: v.value });
            }}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                {#each items as item}
                    <SelectItem value={item.value}>{item.label}</SelectItem>
                {/each}
            </SelectContent>
        </Select>
        <div class="rounded-md border">
            <Calendar bind:value={date} minValue={futureOnly ? now("UTC") : undefined}/>
        </div>
        <div class="flex flex-row items-center">
            <span class="mr-4">Time</span>
            <!--Time picker (hours and minutes)-->
            <Input type="number" min="0" max="23" class="size-12 px-1 text-center {hoursBorder}" bind:value={hours}/>
            <span class="mx-2">:</span>
            <Input type="number" min="0" max="59" class="size-12 px-1 text-center {minutesBorder}" bind:value={minutes}/>
        </div>
        {#if value === null || (value && value < new Date())}
            <FieldErrors>
                Invalid date! Please select a valid date.
            </FieldErrors>
        {/if}
    </PopoverContent>
</Popover>
