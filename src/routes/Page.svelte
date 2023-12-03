<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {Avatar, AvatarFallback, AvatarImage} from "$lib/components/ui/avatar";
    import {page} from "$app/stores";
    import {Home} from "lucide-svelte";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import {pageName} from "$lib/page_props";
    import {linkStyles} from "$lib/svelte_utils";
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

<div class="navbar z-80">
    <div class="home">
        {#if $page.route.id !== "/"}
            <Button variant="secondary" class="w-10 h-10 p-2" href="/"><Home/></Button>
            <slot name="navbar-left">
                {#if $pageName}
                    <H2>{$pageName}</H2>
                {/if}
            </slot>
        {/if}
    </div>
    <div class="buttons">
        <Button variant="secondary" class={linkStyles("search", $page)} href="/search">Search a Contest</Button>
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
