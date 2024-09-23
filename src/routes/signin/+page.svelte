<script>
    import { signIn } from "@auth/sveltekit/client";
    import { browser } from "$app/environment";

    if (browser) {
        signIn("oidc", {
            callbackUrl: document.referrer ?? "/"
        })
    }
</script>
