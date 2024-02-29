import { SvelteKitAuth } from "@auth/sveltekit";
import {
    PRIVATE_OIDC_CLIENT_ID as OIDC_CLIENT_ID,
    PRIVATE_OIDC_CLIENT_SECRET as OIDC_CLIENT_SECRET,
    PRIVATE_OIDC_SERVER_URL as OIDC_SERVER_URL,
} from "$env/static/private";
import type { OIDCConfig } from "@auth/core/providers";
import type { CasdoorProfile } from "./types";
import type { MySession } from "./routes/+layout.server";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { parseInteger } from "$lib/javascript_utils";
import { MAX_COOKIE_AGE, MAX_SCALE, MIN_SCALE } from "$lib/scale";

const auth = SvelteKitAuth({
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
        // @ts-expect-error token IS there, typescript's scuffed type system and the weird library typings
        // lead to multiple different combinations, but this one is the correct one with this configuration
        session({session, token}) {
            (session as MySession).access_token = token.access_token;
            if (session.user) {
                session.user.id = token.id;
            }
            return session
        }
    }
});

const fontSize: Handle = async ({event, resolve}) => {
    const cookies = event.cookies
    return resolve(event, {
        transformPageChunk: ({html}) => {
            // This section will modify the HTML
            // before being returned to the client
            let scale = parseInteger(cookies.get("scale"));

            if (scale && (scale > MAX_SCALE || scale < MIN_SCALE)) {
                scale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
                cookies.set("scale", scale.toString(), {
                    maxAge: MAX_COOKIE_AGE,
                    path: "/",
                    secure: true,
                    sameSite: "lax"
                });
            }

            // Make sure the cookie was found, if not, set it to dark
            if (!scale) {
                return html;
            }

            // set `style` attribute to `html` tag
            return html.replace(`<html`, `<html style="font-size: ${scale}%"`);
        }
    });
}

export const handle = sequence(auth, fontSize)
