import { initApiClients } from "$lib/client/api_client";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ data }) => {
    const session = data.session
    if (session?.access_token)
        initApiClients(session.access_token)
}
