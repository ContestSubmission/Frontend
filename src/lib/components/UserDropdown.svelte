<script>
    import { signOut } from "@auth/sveltekit/client";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { Dialog } from "$lib/components/ui/dialog";
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuGroup,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger
    } from "$lib/components/ui/dropdown-menu";
    import ScalePopup from "$lib/components/ScalePopup.svelte";
    import colors from "tailwindcss/colors";

    export let avatar = "";
    export let initials = "";

    let scaleDialogOpen = false;
</script>

<Dialog bind:open={scaleDialogOpen}>
    <DropdownMenu>
        <DropdownMenuTrigger class="h-fit">
            <Avatar>
                <AvatarImage src={avatar} alt="profile picture"/>
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem on:click={() => scaleDialogOpen = true}>Change scale</DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem on:click={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    <ScalePopup/>
</Dialog>
