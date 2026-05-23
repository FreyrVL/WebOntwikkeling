import express, { Express } from "express";
import path from "path";
import homeRouter from "./routes/homerouter";
import detailsTransformerRouter from "./routes/detailstransformerrouter";
import detailsOriginRouter from "./routes/detailsoriginrouter";
import originsRouter from "./routes/originsrouter";

import { connectToDatabase, populateDB } from "./database";

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'dist')))

app.set("port", process.env.PORT || 3000);

app.use("/", homeRouter);
app.use("/transformer", detailsTransformerRouter);
app.use("/origin", detailsOriginRouter)
app.use("/origins", originsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try{
        await connectToDatabase();
        await populateDB();
        console.log("Server started on http://localhost:" + app.get('port'));
    }
    catch(e){
        console.log("Error encountered: " + e);
    }
});