import type { LayoutServerLoad } from "./$types";
import type { Session as OGSession } from "@auth/core/types";
import { initApiClients } from "$lib/client/api_client";

export interface MySession extends OGSession {
    user: {
        id: string,
        name: string,
        displayName: string,
        firstName: string,
        lastName: string,
        email: string,
        image: string
    }
}

export const load: LayoutServerLoad = async (event) => {
    const session = (await event.locals.auth()) as (MySession | null);
    if (session?.access_token)
        initApiClients(session.access_token)
    return {
        session: session
    };
};
