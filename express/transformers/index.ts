import express, { Express } from "express";
import path from "path";
import homeRouter from "./routes/homerouter";
import detailsTransformerRouter from "./routes/detailstransformerrouter";
import detailsOriginRouter from "./routes/detailsoriginrouter";
import originsRouter from "./routes/originsrouter";
import session, { MemoryStore } from "express-session";
import { secureMiddleware } from "./middleware/sessionMiddleware";
import MongoStore from 'connect-mongo'
import { connectToDatabase, populateDB, populateUsers } from "./database";
import { User } from "./types/user";
import dotenv from "dotenv";

dotenv.config();
const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'dist')))

app.set("port", process.env.PORT || 3000);

const PORT = process.env.PORT || 3000;

//Session
const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: "sessions",
    collectionName: "login"   
});

mongoStore.on("error", (error) => {
    console.error(error);
});

declare module 'express-session' {
    export interface SessionData {
        user?: User
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "supersecret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});

app.use(session);

app.use("/", secureMiddleware, homeRouter);
app.use("/transformer", secureMiddleware,  detailsTransformerRouter);
app.use("/origin", secureMiddleware,  detailsOriginRouter)
app.use("/origins", secureMiddleware,  originsRouter);

app.listen(PORT, async () => {
    try{
        await connectToDatabase();
        await populateDB();
        await populateUsers();
        console.log("Server started on http://localhost:" + app.get('port'));
    }
    catch(e){
        console.log("Error encountered: " + e);
    }
});