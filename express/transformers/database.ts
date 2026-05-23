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

const db = client.db("webontwikkeling");
const transformersCollection = db.collection<Transformer>("transformers");
const originsCollection = db.collection<Origin>("origins");

async function connectToDatabase() {
    try {
        await client.connect();
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

async function getTransformers(): Promise<Transformer[]> {
    return await transformersCollection.find().toArray() as Transformer[];
}

async function getTransformerById(id: string): Promise<Transformer | null> {
    return await transformersCollection.findOne({ id }) as Transformer | null;
}

async function getOrigins(): Promise<Origin[]> {
    return await originsCollection.find().toArray() as Origin[];
}

async function getOriginsById(id: string): Promise<Origin | null> {
    return await originsCollection.findOne({ id }) as Origin | null;
}

async function updateTransformer(id: string, data: Partial<Transformer>): Promise<void> {
    await transformersCollection.updateOne(
        { id },
        {
            $set: {
                name: data.name,
                age: data.age,
                faction: data.faction,
                isActive: data.isActive,
                birthDate: data.birthDate,
                description: data.description,
            }
        }
    );
}

async function updateOrigin(id: string, data: Partial<Origin>): Promise<void> {
    await originsCollection.updateOne(
        { id },
        {
            $set: {
                title: data.title,
                type: data.type,
                releaseYear: data.releaseYear,
                director: data.director,
                studio: data.studio,
            }
        }
    );
}

export { db, connectToDatabase, populateDB, getTransformers, getTransformerById, getOrigins, getOriginsById, updateOrigin, updateTransformer };