import { NextResponse } from "next/server";
import { createBookSchema } from "@/types/bookSchema";
import { Book, Prisma, PrismaClient, ReadingStatus } from "@prisma/client";
import { ZodError } from "zod";

/*
uuidv4() generates a unique ID.
These IDs are often used for uniquely identifying items, like books in a list.
*/

const prisma = new PrismaClient();
const allowedStatuses = Object.values(ReadingStatus) as string[];

/*
Rule of Thumb
api/entries/route.ts → collection-level routes
- GET → fetch all entries
- POST → create a new entry

api/entries/[id]/route.ts → item-level routes
- GET → fetch a single entry by ID
- PUT/PATCH → update an entry
- DELETE → delete an entry
*/


/*
Handles GET requests to this API route, and returns the array as JSON.
*/

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const statusParam = searchParams.get("status")

    const status: ReadingStatus | undefined = 
      statusParam && ["unread", "reading", "finished"].includes(statusParam)
      ? statusParam as ReadingStatus
      : undefined
    
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "5")

    const where: Prisma.BookWhereInput = {}

    if (search) {
      const orFilters: Prisma.BookWhereInput["OR"] = [
        // otherwise, get error 'mode' does not exist in type 'StringNullableFilter<"Book">'
        // advanced technique that bypasses type safety! be careful!
        { title: { contains: search } }, 
        { author: {contains: search } }
      ]
      where.OR = orFilters
    }

    if (status) {
      where.status = status
    }

    const books = await prisma.book.findMany({
      where, 
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc"}
    })

    const total = await prisma.book.count({ where })

    return NextResponse.json({
      data: books, 
      pagination: {
        page, 
        limit, 
        total, 
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.log("GET /entries error: ", error)
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500})
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
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create entry." }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params } : { params: { id: string }}) {
  try {
    const body = await req.json()

    const { title, author, status, startedAt, finishedAt } = body
    // Use Partial to allow optional properties
    const data: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">> = {};
    if (title !== undefined) data.title = title
    if (author !== undefined) data.author = author
    if (status !== undefined) data.status = status
    if (startedAt !== undefined) data.startedAt = startedAt
    if (finishedAt !== undefined) data.finishedAt = finishedAt

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data
    })

    return NextResponse.json(updatedBook, { status: 200})
  } catch (error) {
    console.log("PATCH /api/entires error: ", error)
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
  }
}