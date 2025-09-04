import { NextResponse } from "next/server";
import { createBookSchema } from "@/types/bookSchema";
import { PrismaClient, ReadingStatus } from "@prisma/client";
import { ZodError } from "zod";

/*
uuidv4() generates a unique ID.
These IDs are often used for uniquely identifying items, like books in a list.
*/

const prisma = new PrismaClient();
const allowedStatuses = Object.values(ReadingStatus) as string[];

/*
Handles GET requests to this API route, and returns the array as JSON.
*/

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status ${status}. Allowed statuses: ${allowedStatuses.join(", ")}`}, 
        { status: 400 }
      )
    }

    let where = {};
    if (status && ["unread", "reading", "finished"].includes(status)) {
        where = { status: status as ReadingStatus };
    }
    const books = await prisma.book.findMany({
      where,
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(books, { status: 200 })
  } catch (e) {
    console.error("GET /api/entries error: ", e);
    return NextResponse.json({ error: "Failed to fetch entries."}, { status: 500 })
  }
}

/*
Handles POST requests (i.e. when the frontend sends data to add a book).
It reads the JSON body of the request using await req.json().
...body: spreads the properties from the submitted data into the object (like title, author, etc.)
*/

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const parsed = createBookSchema.parse(data);

    const newBook = await prisma.book.create({
      data: {
        title: parsed.title, 
        author: parsed.author ?? null, 
        status: parsed.status,
        startedAt: parsed.startedAt ? new Date(parsed.startedAt) : null,
        finishedAt: parsed.finishedAt ? new Date(parsed.finishedAt) : null,
      }
    })

    return NextResponse.json(newBook, { status: 201 });
  } catch (e) {
    console.error("POST /api/entries error: ", e);

    if (e instanceof ZodError) {
      return NextResponse.json({ error: e.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create entry." }, { status: 500 });
  }
}