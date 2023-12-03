export function linkStyles(url: string,
                           page: import('@sveltejs/kit').Page,
                           classes: string = "bg-yellow-400 text-slate-700 hover:bg-yellow-300") {
    if (page.url.pathname.startsWith("/" + url)) {
        return classes;
    }
}
