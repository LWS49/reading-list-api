import { NextResponse } from "next/server";
import { Book } from "@/types/book";
import { bookSchema } from "@/types/bookSchema";
import { PrismaClient} from "@prisma/client";

/*
uuidv4() generates a unique ID.
These IDs are often used for uniquely identifying items, like books in a list.
*/

const allowedStatuses = ["unread", "reading", "finished"];
const readingList: Book[] = globalThis.readingList || (globalThis.readingList = []);

/*
Handles GET requests to this API route, and returns the array as JSON.
*/

export async function GET(req: Request) {
  const url = new URL(req.url);
  // Get the "status" query parameter, e.g. ?status=reading
  const status = url.searchParams.get("status");

  if (status && !allowedStatuses.includes(status)) {
    return NextResponse.json(
        { error: `Invalid status '${status}'. Allowed: ${allowedStatuses.join(", ")}`},
        { status: 400}
    );
  }

  const filteredList = status 
    ? readingList.filter(book => book.status === status)
    : readingList;

  return NextResponse.json(filteredList);
}

/*
Handles POST requests (i.e. when the frontend sends data to add a book).
It reads the JSON body of the request using await req.json().
...body: spreads the properties from the submitted data into the object (like title, author, etc.)
*/

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = bookSchema.parse(data);
    readingList.push(parsed);
    return NextResponse.json(parsed, { status: 201 });
  } catch (e) {
    console.error('Unexpected error:', e);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 400});
  }
}