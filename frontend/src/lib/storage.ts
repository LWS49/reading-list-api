import fs from "fs/promises"; // Node.js filesystem module
import path from "path";
import { Book } from "@/types/book";

// process.cwd() returns the current working directory
// thus, DB_PATH holds the absolute path to the file with data persistently
const DB_PATH = path.join(process.cwd(), "data.json");

export async function readDB(): Promise<Book[]> {
    try {
        //reads the file at data.json as a string ("utf-8" encoding)
        const data = await fs.readFile(DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function writeDB(items: Book[]) {
    // stringify convers Javascript array into pretty-printed JSON string (2 means indent w 2 spaces)
    await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2));
}

/*
Note: not optimized for concurrent writes or large datasets
blocks other file access during writes, may lose data and cause race conditions
*/
