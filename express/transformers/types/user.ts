import { ObjectId, ServerSessionId } from "mongodb";

export interface User {
    _id?: ServerSessionId,
    username: string,
    password: string,
    role: "ADMIN" | "USER"
}