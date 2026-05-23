import { Router, Request, Response } from "express";
import { Origin } from "../types/origin";
import { getOriginsById } from "../database";

const router = Router();

router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    try {   
        const origin: Origin | null = await getOriginsById(slug.toString());
        if (origin) {

            res.render("origin", {
                title: `${origin.title} - details`,
                origin: origin
            });

            return;
        }

    } catch (error) {

        console.error("JSON data fetch error: ", error);

        res.render("origins", {
            title: "Origins",
            origins: []
        });

        return;
    }

    res.render("origin", {
        title: "Origin not found",
        origin: null
    });
});

export default router;