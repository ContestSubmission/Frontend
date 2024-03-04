import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { parseInteger } from "$lib/javascript_utils";
import { MAX_COOKIE_AGE, MAX_SCALE, MIN_SCALE } from "$lib/scale";
import { handle as auth } from "./auth"

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
