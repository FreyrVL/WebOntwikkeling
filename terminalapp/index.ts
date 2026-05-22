import readlineSync from "readline-sync";
import { Transformer } from "./types/transformer";
import { Origin } from "./types/origin";

//URL's to JSON files on git repo
const TRANSFORMERS_URL = "https://raw.githubusercontent.com/FreyrVL/json/main/transformers.json";

//Fetch methods
//Fetch transformers
async function fetchTransformers(): Promise<Transformer[]> {
    try {
        const response = await fetch(TRANSFORMERS_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch transformers JSON");
        }

        return await response.json() as Transformer[];
    } catch (error) {
        console.log("Error:", error);
        return [];
    }
}

//Main method
async function app(): Promise<void> {
    const transformers = await fetchTransformers();

    let running = true;

    while (running) {
        console.log("\nWelcome to the JSON data viewer!\n");
        console.log("1. View all data");
        console.log("2. Filter by ID");
        console.log("3. Exit\n");

        const choice: number = readlineSync.questionInt("Please enter your choice: ");

        switch (choice) {
            case 1:
                transformers.forEach(transformer => {
                    console.log(`- ${transformer.name} (${transformer.id})`);
                });
                break;

            case 2:
                const id = readlineSync.questionInt("Please enter the ID you want to filter by: ");
                const transformer = transformers.find(transformer => transformer.id === id);

                if (transformer) {
                    console.log(`- ${transformer.name} (${transformer.id})`);
                    console.log(`\t- Description: ${transformer.description}`);
                    console.log(`\t- Age: ${transformer.age}`);
                    console.log(`\t- Alive/active: ${transformer.isActive?'Yes':'No'}`);
                    console.log(`\t- Date of birth: ${transformer.birthDate}`);
                    console.log(`\t- Faction: ${transformer.faction}`);
                    console.log(`\t- Abilities: ${transformer.abilities.concat(',')}`);
                    console.log(`\t- Origin:`);
                    console.log(`\t\t- ${transformer.origin.type} title: ${transformer.origin.title}`);
                    console.log(`\t\t- Release year: ${transformer.origin.releaseYear}`);
                    console.log(`\t\t- Directed by: title: ${transformer.origin.director}`);
                    console.log(`\t\t- Published by studio: ${transformer.origin.studio}`);
                } else {
                    console.log("Transformer not found.");
                }
                break;

            case 3:
                console.log("Thanks for using the JSON data viewer and goodbye!");
                running = false;
                break;
            default:
                console.log("Please choose an option from 1 to 3: ");
        }
    }
}

app();