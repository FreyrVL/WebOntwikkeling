import express, { Express } from "express";
import path from "path";
import homeRouter from "./routes/homerouter";
import detailsTransformerRouter from "./routes/detailstransformerrouter";
import detailsOriginRouter from "./routes/detailsoriginrouter";
import originsRouter from "./routes/originsrouter";
import loginRouter from "./routes/loginrouter";
import logoutRouter from "./routes/logoutrouter";
import registerRouter from "./routes/registerrouter";
import session, { MemoryStore } from "express-session";
import { requireAuth, secureMiddleware } from "./middleware/sessionMiddleware";
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

app.use(session({
    secret: process.env.SECRET ?? "supersecret",
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: "sessions"
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/logout", logoutRouter);

app.use(requireAuth); 

app.use("/",homeRouter);
app.use("/transformer",  detailsTransformerRouter);
app.use("/origin",  detailsOriginRouter)
app.use("/origins",  originsRouter);


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