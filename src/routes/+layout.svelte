<script lang="ts">
    import "../app.pcss";
    import {Button} from "$lib/components/ui/button";
    import {Avatar, AvatarFallback, AvatarImage} from "$lib/components/ui/avatar";
    import {page} from "$app/stores";
    import {Home} from "lucide-svelte";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import {pageName} from "$lib/page_props";
    import {beforeNavigate} from "$app/navigation";

    beforeNavigate(() => pageName.set(null));
</script>

<svelte:head>
    <!-- either 'pageName | ContestSubmission' or 'ContestSubmission' -->
    <title>{$pageName ? $pageName + " | " : ""}ContestSubmission</title>
    <style>
        html {
            min-height: 100vh;
            background: radial-gradient(89.33% 89.33% at 100% 10.67%, rgba(212, 25, 118, 0.33) 0%, rgba(212, 25, 118, 0.00) 100%),
            radial-gradient(88.75% 88.75% at 0% 11.25%, rgba(79, 70, 229, 0.33) 0%, rgba(79, 70, 229, 0.00) 100%),
            #242C46
            no-repeat;
            background-size: cover;
        }
    </style>
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
