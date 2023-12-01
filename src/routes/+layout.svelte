<script lang="ts">
    import "../app.pcss";
    import {Button} from "$lib/components/ui/button";
    import {Avatar, AvatarFallback, AvatarImage} from "$lib/components/ui/avatar";
    import {page} from "$app/stores";
    import {Home} from "lucide-svelte";
</script>

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
    }

    .buttons {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.75rem;
    }
</style>

<div class="navbar">
    <div class="home">
        {#if $page.route.id !== "/"}
                <Button variant="secondary" href="/"><Home/></Button>
        {/if}
    </div>
    <div class="buttons">
        <Button variant="secondary" href="?">Search a Contest</Button>
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
