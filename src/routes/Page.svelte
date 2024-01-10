<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { page } from "$app/stores";
    import { Home, Medal, Plus, Search } from "lucide-svelte";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import { pageName } from "$lib/page_props";
    import { buttonNameBuilder, linkStyles } from "$lib/svelte_utils";
    import { PUBLIC_EXTRA_SCRIPT_URL as EXTRA_SCRIPT_URL } from "$env/static/public";
</script>

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

<sveltekit:head>
    {#if EXTRA_SCRIPT_URL}
        <script type="text/javascript" src={EXTRA_SCRIPT_URL} crossorigin="anonymous" defer></script>
    {/if}
</sveltekit:head>

<div class="navbar z-80">
    <div class="home">
        {#if $page.route.id !== "/"}
            <Button variant="secondary" class="w-10 h-10 p-2" href="/" builders={[buttonNameBuilder("Homepage")]}>
                <Home/>
            </Button>
            <slot name="navbar-left">
                {#if $pageName}
                    <H2>{$pageName}</H2>
                {/if}
            </slot>
        {/if}
    </div>
    <div class="buttons">
        <Button variant="secondary" class={linkStyles("search", $page)} href="/search">
            <Search class="mr-2 h-4 w-4"/>
            Search
        </Button>
        <Button variant="secondary" href="?">
            <Plus class="mr-2 h-4 w-4"/>
            Create
        </Button>
        <Button variant="secondary" href="?">
            <Medal class="mr-2 h-4 w-4"/>
            Participations
        </Button>
        <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/63104422?v=4" alt="profile picture"/>
            <AvatarFallback>JH</AvatarFallback>
        </Avatar>
    </div>
</div>

<div class="content">
    <slot/>
</div>
