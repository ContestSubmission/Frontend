import type {Builder} from "bits-ui";

export function linkStyles(url: string,
                           page: import('@sveltejs/kit').Page,
                           classes: string = "bg-yellow-400 text-slate-700 hover:bg-yellow-300") {
    if (page.url.pathname.startsWith("/" + url)) {
        return classes;
    }
}

export const buttonNameBuilder = (name: string): Builder => ({
    // @ts-expect-error it works anyway lmfao
    action: (node: HTMLButtonElement) => {
        node.name = name;
        node.ariaLabel = name;
    }
});
