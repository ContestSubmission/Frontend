<script lang="ts">
    import Page from "$lib/components/Page.svelte";
    import { fade } from "svelte/transition";
    import { page } from "$app/stores";
    import FullPageCentered from "$lib/components/utils/FullPageCentered.svelte";
    import { Resources } from "$lib/client/api_client";
    import { signIn } from "@auth/sveltekit/client";
    import { browser } from "$app/environment";
    import { Stretch } from "svelte-loading-spinners";
    import colors from "tailwindcss/colors";
    import { streamToString } from "$lib/javascript_utils";
    import { jwtDecode } from "jwt-decode";
    import type { InviteJWT } from "$lib/client/invite";

    let passedJwt = $page.data.jwt;
    let jwt: InviteJWT = jwtDecode(passedJwt);

    if (browser && !$page.data.session) {
        signIn("oidc");
    }
</script>

<style>
    div {
        min-height: 100vh;
        min-width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
    }
</style>

<Page pageName="Accept invite">
    {#if $page.data.session}
        <FullPageCentered>
            {#await Resources.invite.inviteAcceptPost({ invite: passedJwt })}
                <div transition:fade>
                    <Stretch color={colors.slate['100']} />
                    <p>Accepting invite...</p>
                </div>
            {:then _}
                <div transition:fade>
                    <p>Invite accepted!</p>
                    <p>Redirecting to contest...</p>
                    {window.location.href = `/contest/${jwt.contestId}/overview?fromInvite=true`}
                    <p><i>If this doesn't work, click <a class="underline" href="/contest/{jwt.contestId}/overview?fromInvite=true">here</a></i>
                    </p>
                </div>
            {:catch error}
                {#await streamToString(error.response.body)}
                    <div transition:fade>
                        <p>Error: {error.response.status} {error.response.statusText}</p>
                        <p>Loading error message...</p>
                    </div>
                {:then body}
                    <div transition:fade>
                        {#if error.response.status !== 400}
                            <p>Error: {error.response.status} {error.response.statusText}</p>
                        {/if}
                        {#if body}
                            <p>{body}</p>
                        {/if}
                    </div>
                {/await}
            {/await}
        </FullPageCentered>
    {/if}
</Page>
