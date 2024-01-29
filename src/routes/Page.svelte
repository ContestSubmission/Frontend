<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { page } from "$app/stores";
    import { Home, Medal, Plus, Search } from "lucide-svelte";
    import H2 from "$lib/components/utils/typography/H2.svelte";
    import { buttonNameBuilder, linkStyles } from "$lib/svelte_utils";
    import { PUBLIC_EXTRA_SCRIPT_URL as EXTRA_SCRIPT_URL } from "$env/static/public";
    import { signIn, signOut } from "@auth/sveltekit/client";

    let user = $page.data.session?.user;
    let avatar = user?.image;
    function _fromFullName() {
        if (user?.firstName == null || user.lastName[0] == null) return null;
        return user.firstName[0] + user.lastName[0];
    }
    let initials = (_fromFullName()
        ?? $page.data.session?.user?.displayName?.split(" ").map((name) => name[0]).join("")
        ?? $page.data.session?.user?.name?.split(" ").map((name) => name[0]).join("") ?? "??")
        .substring(0, 2);

    export let pageName: string;

    let classes = "";
    export { classes as class };
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
    <!-- either 'pageName | ContestSubmission' or 'ContestSubmission' -->
    <title>{pageName ? pageName + " | " : ""}ContestSubmission</title>
</sveltekit:head>

<div class="navbar z-80">
    <div class="home">
        {#if $page.route.id !== "/"}
            <Button variant="secondary" class="w-10 h-10 p-2" href="/" builders={[buttonNameBuilder("Homepage")]}>
                <Home/>
            </Button>
            <slot name="navbar-left">
                {#if pageName}
                    <H2>{pageName}</H2>
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
        <Button variant="secondary" class={linkStyles("participations", $page)} href="/participations">
            <Medal class="mr-2 h-4 w-4"/>
            Participations
        </Button>
        {#if $page.data.session != null}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger class="h-fit">
                    <Avatar>
                        <AvatarImage src={avatar} alt="profile picture"/>
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item on:click={() => signOut()}>Logout</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        {:else}
            <Button variant="secondary" on:click={() => signIn('oidc')}>
                Login
            </Button>
        {/if}
    </div>
</div>

<div class="content {classes}">
    <slot/>
</div>
