import type {Builder} from "bits-ui";

export function linkStyles(url: string,
                           page: import('@sveltejs/kit').Page,
                           classes: string = "bg-yellow-400 text-slate-700 hover:bg-yellow-300") {
    if (page.url.pathname.startsWith("/" + url)) {
        return classes;
    }
}

export const buttonNameBuilder = (name: string): Builder => ({
    action: (node: HTMLButtonElement) => {
        node.name = name;
        node.ariaLabel = name;
    }
});

// https://github.com/WhereCanI/svelte-cookie/blob/8e379f567a81a39d89a344faf8f9afde9606219f/src/SvelteCookie.svelte
export function getCookie(name: string) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(const element of ca) {
        const c = element.trimStart();
        if (c.startsWith(cookieName)) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return "";
}

export function setCookie(name: string, value: string, exdays: number, secure: boolean) {
    const exp = new Date();
    exp.setTime(exp.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + exp.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/" + (secure ? "; secure" : "");
}

export function deleteCookie(name: string) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

/**
 * Utility function to allow for silent execution of a command.
 * @param arg - Either a function to execute or some ignored garbage
 * @param _args - Ignored garbage
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function execSilently(arg: any | (() => (never)), ..._args: never[]) { // NOSONAR
    if (typeof arg === "function") {
        arg();
    }

    return "";
}
