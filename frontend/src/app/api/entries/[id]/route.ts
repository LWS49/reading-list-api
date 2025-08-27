import { Book } from "@/types/book";
import { NextResponse } from "next/server";

// Access the shared in-memory list
const readingList: Book[] = globalThis.readingList || (globalThis.readingList = []);

// GET /api/reading-list/:id → get a single book
export async function GET(req: Request, {params} : { params: { id: string }}) {
    const book = readingList.find((item) => item.id === params.id);

    if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
}

// PUT /api/reading-list/:id → update a book
export async function PUT(req: Request, { params }: { params: { id: string }}){
    const index = readingList.findIndex((item) => item.id === params.id);
    console.log("PUT request for id:", params.id);
    console.log("Current readingList IDs:", readingList.map(b => b.id));

    if (index === -1) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const updates = await req.json();
    readingList[index] = { ...readingList[index], ...updates };

    return NextResponse.json(readingList[index]);
}

// DELETE /api/reading-list/:id → remove a book
export async function DELETE(req: Request, { params }: { params: { id: string }}) {
    const index = readingList.findIndex((item) => item.id === params.id);

    if (index === -1) {
        return NextResponse.json({ error: "Book not found" }, { status: 404});
    }

    // removes 1 item starting at pos index in-place, and returns the first item (the deleted book)
    const deleted = readingList.splice(index, 1)[0];
    return NextResponse.json(deleted, {status: 200});
}