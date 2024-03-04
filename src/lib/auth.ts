import type { Session as OGSession } from "@auth/core/types";
import { browser } from "$app/environment";
import { signIn } from "@auth/sveltekit/client";
import type { Page } from "@sveltejs/kit";

export interface MyUser {
    id: string,
    name: string,
    displayName: string,
    firstName: string,
    lastName: string,
    email: string,
    image: string
}

export interface MySession extends OGSession {
    user: MyUser,
    access_token: string
}

/**
 * If the user isn't logged in by the time authentication is done, prompt them to sign in
 */
export function ensureLoggedIn($page: Page) {
    if (browser && !$page.data.session) {
        void signIn("oidc");
    }
}
