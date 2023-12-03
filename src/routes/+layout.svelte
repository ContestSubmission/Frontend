<script lang="ts">
    import "../app.pcss";
    import {Button} from "$lib/components/ui/button";
    import {Avatar, AvatarFallback, AvatarImage} from "$lib/components/ui/avatar";
    import {page} from "$app/stores";
    import {Home} from "lucide-svelte";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import {pageName} from "$lib/page_props";
    import {onNavigate} from "$app/navigation";

    onNavigate(() => pageName.set(null));
</script>

<svelte:head>
    <!-- either 'pageName | ContestSubmission' or 'ContestSubmission' -->
    <title>{$pageName ? $pageName + " | " : ""}ContestSubmission</title>
</svelte:head>

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
    }

    .buttons, .home {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.75rem;
    }
</style>

<div class="navbar z-80">
    <div class="home">
        {#if $page.route.id !== "/"}
            <Button variant="secondary" class="w-10 h-10 p-2" href="/"><Home/></Button>
            {#if $pageName}
                <H2>{$pageName}</H2>
            {/if}
        {/if}
    </div>
    <div class="buttons">
        <Button variant="secondary" href="/search">Search a Contest</Button>
        <Button variant="secondary" href="?">Create a Contest</Button>
        <Button variant="secondary" href="?">Participations</Button>
        <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/63104422?v=4"/>
            <AvatarFallback>JH</AvatarFallback>
        </Avatar>
    </div>
</div>

<div class="content">
    <slot/>
</div>
