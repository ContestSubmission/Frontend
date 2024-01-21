// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { MySession } from "./routes/+layout.server";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			session?: MySession | null
		}
		// interface Platform {}
	}
}

export {};
