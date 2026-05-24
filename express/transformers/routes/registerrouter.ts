import bcrypt from "bcrypt";
import { Router, Request, Response } from "express";
import { findUser, addUser } from "../database";

const router = Router();
router.get("/", (req: Request, res: Response) => {
    res.render("register",{title:"Register"});
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.render("register", {
            title: "Register",
            error: "Please fill in all fields."
        });
    }
    
    const existing = await findUser(username);
    if (existing) {
        return res.render("register", {
            title: "Register",
            error: "Username already exists."
        });
    }
    const hashed = await bcrypt.hash(password, 10);
    await addUser(username, hashed);
    res.redirect("/login");
});

export default router;