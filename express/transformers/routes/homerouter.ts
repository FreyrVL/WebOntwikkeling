import {Router, Request, Response } from "express";
import {Transformer} from "../types/transformer";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    const { search, sortby, order } = req.query;

    const transformersUrl = "https://raw.githubusercontent.com/FreyrVL/json/main/transformers.json";

    try {
        const response = await fetch(transformersUrl);
        const transformersData: Transformer[] = await response.json();

        let transformers: Transformer[] = transformersData;

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

    } catch (error) {
        console.error("JSON data fetch error: ", error);
        res.render("index", { title: "Home", tranformers: [], query:req.query });
    }
});

export default router;