import { NextFunction, Request, Response } from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }
    next();
};
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        res.redirect("/login");
        return;
    }
    next();
}
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.session.user?.role !== "ADMIN") {
        res.status(403).send("Forbidden");
        return;
    }
    next();
}