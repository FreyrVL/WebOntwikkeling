import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
import { Transformer } from "./types/transformer";
import { Origin } from "./types/origin";
import { User } from "./types/user";
import bcrypt from "bcrypt";
dotenv.config();

const uri = process.env.MONGO_URI;

if(uri === undefined)
    {
        console.error("No MONGO_URI found in env variables");
        process.exit();
    }

export const client = new MongoClient(uri);

export const db = client.db("webontwikkeling");
const transformersCollection = db.collection<Transformer>("transformers");
const originsCollection = db.collection<Origin>("origins");
const usersCollection = db.collection<User>("users");

//Milestone 3 - Mongodb
export async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB database.");

    } catch (e) {
        console.error(e);
    }
}

export async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database.");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function populateDB(){
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

export async function getTransformers(): Promise<Transformer[]> {
    return await transformersCollection.find().toArray() as Transformer[];
}

export async function getTransformerById(id: string): Promise<Transformer | null> {
    return await transformersCollection.findOne({ id }) as Transformer | null;
}

export async function getOrigins(): Promise<Origin[]> {
    return await originsCollection.find().toArray() as Origin[];
}

export async function getOriginsById(id: string): Promise<Origin | null> {
    return await originsCollection.findOne({ id }) as Origin | null;
}

export async function updateTransformer(id: string, data: Partial<Transformer>): Promise<void> {
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

export async function updateOrigin(id: string, data: Partial<Origin>): Promise<void> {
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

//Milestone 4 - Users
export async function populateUsers() {
    try {
        const count = await usersCollection.countDocuments();

        if (count == 0) {
            const adminPassword = await bcrypt.hash("verysafeadminpassword123", 10);
            const userPassword = await bcrypt.hash("totallysafepassword123", 10);
            await usersCollection.insertMany([
                {
                    username: "admin",
                    password: adminPassword,
                    role: "ADMIN"
                },
                {
                    username: "user",
                    password: userPassword,
                    role: "USER"
                }
            ]);
            console.log("Succesfully populated users collection.");
        }
        
    }
    catch (error) {
        console.log("Error populating users collection.");
    }
}

export async function login(username: string, password: string) {
if (!username || !password) return null;

    const user = await usersCollection.findOne<User>({ username });

    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password!);

    if (!valid) return null;

    return user;
}

export async function findUser(username:string){
    let user : User | null = await usersCollection.findOne<User>({username: username});
    return user;
}

export async function addUser(username:string, hashedPassword:string){
    let user : User | null = await usersCollection.findOne<User>({username: username});

    if(!user){
        await usersCollection.insertOne({
        username,
        password: hashedPassword,
        role: "USER"
    });
    }

}