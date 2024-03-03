import type { Session as OGSession } from "@auth/core/types";

export interface MyUser {
    id: string,
    name: string,
    displayName: string,
    firstName: string,
    lastName: string,
    email: string,
    image: string
}

export interface MySession extends OGSession {
    user: MyUser,
    access_token: string
}
