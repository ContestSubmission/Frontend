import {writable} from "svelte/store";

/**
 * Stores the page name, to be used in e.g. the <title> and the navbar
 */
export const pageName = writable<string | null>(null)
