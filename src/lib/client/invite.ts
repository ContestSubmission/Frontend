import type { JwtPayload } from "jwt-decode";
import type { uuid } from "$lib/types";

export interface InviteJWT extends JwtPayload {
    exp: number;
    teamId: uuid;
    contestId: uuid;
}
