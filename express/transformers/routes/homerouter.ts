import {Router, Request, Response } from "express";
import {Transformer} from "../types/transformer";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    console.log("ping!");

    const transformersUrl = "https://raw.githubusercontent.com/FreyrVL/json/main/transformers.json";

    try{
        const response = await fetch(transformersUrl);
        const transformersData = await response.json();

        const transformers: Transformer[] = transformersData.map((transformer: Transformer) => ({
            id: transformer.id,
            name: transformer.name,
            description: transformer.description,
            age: transformer.age,
            isActive: transformer.isActive,
            birthDate: transformer.birthDate,
            imageUrl: transformer.imageUrl,
            imageCredit: transformer.imageCredit,
            faction: transformer.faction,
            abilities: transformer.abilities,
            origin: transformer.origin
        }));

        res.render("index", {
            title: "Home",
            transformers: transformers
        });
    } catch(error){
        console.error("JSON data fetch error: ", error);
        res.render("index", {title:"Home", tranformers:[]});
    }
});
export default router;