import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
import { Transformer } from "./types/transformer";
import { Origin } from "./types/origin";
dotenv.config();

const uri = process.env.MONGO_URI;

if(uri === undefined)
    {
        console.error("No MONGO_URI found in env variables");
        process.exit();
    }

export const client = new MongoClient(uri);
let db: Db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("webontwikkeling");
        console.log("Connected to MongoDB database.");

    } catch (e) {
        console.error(e);
    }
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database.");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

async function populateDB(){
    const db = client.db("webontwikkeling");

    const transformersCollection = db.collection("transformers");
    const originsCollection = db.collection("origins");

    const transformerCount = await transformersCollection.countDocuments();
    const originCount = await originsCollection.countDocuments();

    const transformersUrl = "https://raw.githubusercontent.com/FreyrVL/json/main/transformers.json";
    const originsUrl = "https://raw.githubusercontent.com/FreyrVL/json/main/origins.json";

    const [transformersResponse, originsResponse] = await Promise.all([
        fetch(transformersUrl),
        fetch(originsUrl)
    ]);

    const transformersData = await transformersResponse.json();
    const originsData = await originsResponse.json();

    if (transformerCount === 0) {
        await transformersCollection.insertMany(transformersData);
        console.log("Transformers collection populated succesfully.");
    }

    if (originCount === 0) {
        await originsCollection.insertMany(originsData);
        console.log("Origins collection populated succesfully.");
    }
}
export { db, connectToDatabase, populateDB };