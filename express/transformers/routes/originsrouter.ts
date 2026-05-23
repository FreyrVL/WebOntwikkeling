import { Router, Request, Response } from "express";
import { Origin } from "../types/origin";
import { getOrigins, updateOrigin } from "../database";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {

    const { search, sortby, order } = req.query;

    try {
        let origins: Origin[] | null = await getOrigins();
        if (origins) {
            if (typeof search === "string" && search.trim() !== "") {

                const searchLower = search.toLowerCase();

                origins = origins.filter((origin: Origin) =>
                    origin.title.toLowerCase().includes(searchLower)
                );
            }

            type SortField =
                | "id"
                | "title"
                | "type"
                | "releaseYear"
                | "director"
                | "studio";

            const allowedSortFields: SortField[] = [
                "id",
                "title",
                "type",
                "releaseYear",
                "director",
                "studio"
            ];

            if (
                typeof sortby === "string" &&
                allowedSortFields.includes(sortby as SortField)
            ) {

                origins.sort((a, b) => {

                    const field = sortby as SortField;

                    let valA = a[field];
                    let valB = b[field];

                    if (typeof valA === "string") valA = valA.toLowerCase();
                    if (typeof valB === "string") valB = valB.toLowerCase();

                    if (valA < valB) return order === "desc" ? 1 : -1;
                    if (valA > valB) return order === "desc" ? -1 : 1;

                    return 0;
                });
            }
            res.render("origins", {
                title: "Origins",
                origins,
                query: req.query
            });
        }
    } catch (error) {

        console.error("JSON data fetch error: ", error);

        res.render("origins", {
            title: "Origins",
            origins: [],
            query: {}
        });
    }
});

router.post("/:id/edit", async (req, res) => {
    await updateOrigin(req.params.id, req.body);

    res.redirect("/");
});

export default router;