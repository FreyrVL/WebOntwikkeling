import { Origin } from "./origin";

export interface Transformer{
    id: number,
    name: string,
    description: string,
    age: number,
    isActive: boolean,
    birthDate: string,
    imageUrl: string,
    imageCredit: string,
    faction: string,
    abilities: string[],
    origin: Origin
}