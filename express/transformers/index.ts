import express, { Express } from "express";
import path from "path";
import homeRouter from "./routes/homerouter";
import detailsRouter from "./routes/detailsrouter";

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'dist')))

app.set("port", process.env.PORT || 3000);

app.use("/", homeRouter);
app.use("/transformer", detailsRouter);
app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});