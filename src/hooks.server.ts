import { SvelteKitAuth } from "@auth/sveltekit";
import {
    PRIVATE_OIDC_CLIENT_ID as OIDC_CLIENT_ID,
    PRIVATE_OIDC_CLIENT_SECRET as OIDC_CLIENT_SECRET,
    PRIVATE_OIDC_SERVER_URL as OIDC_SERVER_URL,
} from "$env/static/private";
import type { OIDCConfig } from "@auth/core/providers";
import type { CasdoorProfile } from "./types";
import { PersonResourceApi } from "@contestsubmission/api-client";
import { createConfig } from "$lib/client/api_client";
import type { MySession } from "./routes/+layout.server";

export const handle =
    SvelteKitAuth({
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
            async jwt({ token, account }) {
                if (account) {
                    token.access_token = account.access_token;
                    token.id = account.providerAccountId;
                    // fire-and-forget
                    // required to create the DB entry for the user
                    new PersonResourceApi(createConfig(account.access_token!)).personPost().then()
                }
                return token;
            },
            session({ session, token }) {
                (session as MySession).access_token = token.access_token;
                if (session.user) {
                    session.user.id = token.id;
                }
                return session
            }
        }
    });
