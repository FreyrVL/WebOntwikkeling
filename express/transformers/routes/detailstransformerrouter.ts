import {Router, Request, Response } from "express";
import {Transformer} from "../types/transformer";

const router = Router();

router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
    const {slug} = req.params;
    const transformersUrl = "https://raw.githubusercontent.com/FreyrVL/json/main/transformers.json";

    try{
        const response = await fetch(transformersUrl);
        const transformersData = await response.json();

        const transformer: Transformer = transformersData.find((transformer: Transformer) => transformer.id === slug);
        console.log(transformer);
        console.log(transformer.name);

        res.render("transformer", {title:`${transformer.name} - details`, transformer:transformer});

    } catch(error){
        console.error("JSON data fetch error: ", error);
        res.render("index", {title:"Home", tranformers:[]});
    }
    res.render("transformer", {title:`Transformer not found`, transformer:null});

});
export default router;