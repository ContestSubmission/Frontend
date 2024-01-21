export type DateTime = string
export interface CasdoorProfile extends Record<string, any> {
    owner: string,
    name: string,
    createdTime: DateTime,
    updatedTime: DateTime,
    id: string,
    displayName: string,
    firstName: string,
    lastName: string,
    avatar: string,
    email: string,
    phone: string,
    exp: number,
    iat: number,
    iss: string
}
