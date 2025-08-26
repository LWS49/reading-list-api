import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Book } from "@/types/book";

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
  const body = await req.json();
  const newEntry = { id: uuidv4(), status: "unread", ...body };
  readingList.push(newEntry);
  return NextResponse.json(newEntry, { status: 201 });
}