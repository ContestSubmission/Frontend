<script lang="ts">
    import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
    import { writable } from "svelte/store";
    import type { GradeTeamOverviewDTO, PersonalContestDTO } from "@contestsubmission/api-client";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
    import A from "$lib/components/utils/typography/A.svelte";
    import { addSortBy } from "svelte-headless-table/plugins";
    import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import GradingDropDown from "./GradingDropDown.svelte";
    import type { SuperValidated } from "sveltekit-superforms";
    import type { FormSchema } from "./schema";
    import P from "$lib/components/utils/typography/P.svelte";
    import { isOngoing } from "$lib/contest_utils";
    import { Resources } from "$lib/client/api_client";

    let dataExport: GradeTeamOverviewDTO[];

    export { dataExport as data };

    export let contest: PersonalContestDTO;

    let data = writable(dataExport);

    const table = createTable(data, {
        sort: addSortBy({
            initialSortKeys: [
                { id: "team", order: "asc" }
            ]
        }),
    });

    export let form: SuperValidated<FormSchema>;

    const columns = table.createColumns([
        table.column({
            id: "team",
            header: "Team",
            accessor: ({ team }) => team.name
        }),
        table.column({
            header: "Submission",
            accessor: "submission",
            cell: ({value}) => value && value.url && value.fileName
                ? createRender(A, {href: value.url, target: "_blank"}).slot(value.fileName)
                : createRender(P, {class: isOngoing(contest) ? "text-orange-400" : "text-red-500"}).slot("No submission"),
            plugins: {
                sort: {
                    disable: true
                }
            }
        }),
        table.column({
            header: "Score",
            accessor: ({ score, submission }) => submission ? score : "-"
        }),
        table.column({
            header: "",
            accessor: (grading) => ({ grading, contest, form }),
            cell: ({ value }) => {
                return createRender(GradingDropDown, value)
                    .on("update", async (_) => {
                        let val = await Resources.grade.contestContestIdGradeListGet({contestId: contest.id});
                        data.set(val);
                    });
            },
            plugins: {
                sort: {
                    disable: true
                }
            }
        })
    ]);

    const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
        table.createViewModel(columns);

    const rowClasses = "hover:bg-accent/50";
</script>


<div class="rounded-md border min-w-[50vw] bg-secondary">
    <Table {...$tableAttrs}>
        <TableHeader>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <TableRow class="bg-accent hover:bg-accent">
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                                <TableHead {...attrs} class="text-center">
                                    {#if props.sort.disabled}
                                        <Render of={cell.render()} />
                                    {:else}
                                        <Button variant="ghost" class="hover:bg-secondary" on:click={props.sort.toggle}>
                                            <Render of={cell.render()} />
                                            {#if props.sort.order === "desc"}
                                                <ArrowDown class={"ml-2 h-4 w-4"} />
                                            {:else if props.sort.order === "asc"}
                                                <ArrowUp class={"ml-2 h-4 w-4"} />
                                            {:else}
                                                <ArrowUpDown class={"ml-2 h-4 w-4"} />
                                            {/if}
                                        </Button>
                                    {/if}
                                </TableHead>
                            </Subscribe>
                        {/each}
                    </TableRow>
                </Subscribe>
            {/each}
        </TableHeader>
        <TableBody {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <TableRow {...rowAttrs} class={rowClasses}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <TableCell {...attrs} class="text-center">
                                    <Render of={cell.render()}/>
                                </TableCell>
                            </Subscribe>
                        {/each}
                    </TableRow>
                </Subscribe>
            {/each}
        </TableBody>
    </Table>
</div>
