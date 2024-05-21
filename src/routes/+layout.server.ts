import type { LayoutServerLoad } from "./$types";
import { initApiClients } from "$lib/client/api_client";
import type { MySession } from "$lib/auth";

export const load: LayoutServerLoad = async (event) => {
    const session = (await event.locals.auth()) as (MySession | null);
    if (session?.access_token) {
        initApiClients(session.access_token)
    }
    return {
        session: session
    };
};
