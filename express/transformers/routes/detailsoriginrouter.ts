import { Router, Request, Response } from "express";
import { Origin } from "../types/origin";

const router = Router();

router.get("/:slug", async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const originsUrl = "https://raw.githubusercontent.com/FreyrVL/json/main/origins.json";

    try {

        const response = await fetch(originsUrl);
        const originsData = await response.json();

        const origin: Origin = originsData.find(
            (origin: Origin) => origin.id === slug
        );

        console.log(origin);

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