import {Router, Request, Response } from "express";
import {Transformer} from "../types/transformer";
import { getTransformers, updateTransformer } from "../database";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    const { search, sortby, order } = req.query;

    try {
        let transformers: Transformer[] | null = await getTransformers();

        if(transformers){
            if (typeof search === "string" && search.trim() !== "") {
            const searchLower = search.toLowerCase();

            transformers = transformers.filter((transformer: Transformer) =>
                transformer.name.toLowerCase().includes(searchLower)
            );

        }

        const allowedSortFields = ["id", "name", "age", "faction", "isActive", "birthDate"];

        if (
            typeof sortby === "string" &&
            allowedSortFields.includes(sortby)
        ) {
            transformers.sort((a: any, b: any) => {
                let valA = a[sortby];
                let valB = b[sortby];

                if (typeof valA === "string") valA = valA.toLowerCase();
                if (typeof valB === "string") valB = valB.toLowerCase();

                if (valA < valB) return order === "desc" ? 1 : -1;
                if (valA > valB) return order === "desc" ? -1 : 1;
                return 0;
            });
        }

        res.render("index", {
            title: "Home",
            transformers:transformers,
            query:req.query
        });
        }
    } catch (error) {
        console.error("JSON data fetch error: ", error);
        res.render("index", { title: "Home", tranformers: [], query:req.query });
    }
});

router.post("/:id/edit", async (req, res) => {
    const { id } = req.params;

    const { name, age, faction, isActive, birthDate, description } = req.body;

    await updateTransformer(id, {
        name,
        age: Number(age),
        faction,
        isActive: isActive === "true",
        birthDate,
        description
    });

    res.redirect("/");
});

export default router;