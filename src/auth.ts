import { SvelteKitAuth } from "@auth/sveltekit";
import {
    PRIVATE_OIDC_CLIENT_ID as OIDC_CLIENT_ID, PRIVATE_OIDC_CLIENT_SECRET as OIDC_CLIENT_SECRET,
    PRIVATE_OIDC_SERVER_URL as OIDC_SERVER_URL
} from "$env/static/private";
import type { CasdoorProfile } from "./types";
import type { OIDCConfig } from "@auth/core/providers";
import type { MySession } from "$lib/auth";

export const { handle, signIn, signOut } = SvelteKitAuth({
    // don't believe the "Default:", it's unset per default
    basePath: "/auth",
    providers: [
        {
            id: "oidc",
            name: "OIDC",
            type: "oidc",
            issuer: OIDC_SERVER_URL,
            clientId: OIDC_CLIENT_ID,
            clientSecret: OIDC_CLIENT_SECRET,
            profile(profile: CasdoorProfile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    displayName: profile.displayName,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    image: profile.avatar
                };
            }
        } satisfies OIDCConfig<CasdoorProfile>
    ],
    callbacks: {
        async jwt({token, account}) {
            if (account) {
                token.access_token = account.access_token;
                token.id = account.providerAccountId;
                // fire-and-forget
                // required to create the DB entry for the user
            }
            return token;
        },
        // token IS there, typescript's scuffed type system and the weird library typings
        // lead to multiple different combinations, but this one is the correct one with this configuration
        session({session, token}) {
            (session as never as MySession).access_token = token.access_token as string;
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session
        }
    }
});
