import {Router, Request, Response } from "express";
import {Transformer} from "../types/transformer";
import { getTransformerById } from "../database";

const router = Router();

router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
    const {slug} = req.params;

    try{
        const transformer: Transformer | null = await getTransformerById(slug.toString());
        if(transformer){
            res.render("transformer", {title:`${transformer.name} - details`, transformer:transformer});
        }
    } catch(error){
        console.error("JSON data fetch error: ", error);
        res.render("index", {title:"Home", tranformers:[]});
    }
    res.render("transformer", {title:`Transformer not found`, transformer:null});

});
export default router;