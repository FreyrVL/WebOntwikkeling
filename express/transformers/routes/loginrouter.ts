import { Router, Request, Response } from "express";
import { login } from "../database";

const router = Router();
router.get("/", (req: Request, res: Response) => {
    res.render("login",{title:"Login"});
    
});

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    const user = await login(username, password);

    if (!user) {
        return res.render("login");
    }

    req.session.user = user;

    console.log("User logged in:" + req.session.user.username)
    req.session.save(() => {
    res.redirect("/");
});
});



export default router;