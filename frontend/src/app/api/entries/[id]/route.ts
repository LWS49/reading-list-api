import { Book } from "@/types/book";
import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { handlePrismaNotFound } from "@/lib/apiResponse";

// Access the shared in-memory list
const readingList: Book[] = globalThis.readingList || (globalThis.readingList = []);

// GET /api/reading-list/:id → get a single book
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    // params is now async - you must await it before accessing its properties
    const { id } = await context.params 

    try {
        const book = await prisma.book.findUnique({
            where: { id }
        })

        if (!book) {
            return NextResponse.json({error: "Book not found" }, { status: 404})
        }

        return NextResponse.json({book})
    } catch (error) {
        const handled = handlePrismaNotFound(error)
        if (handled) return handled

        console.log("GET /entries/:id error: ", error)
        return NextResponse.json({error: "Failed to fetch book" }, { status: 500})
    }
}

// PATCH /api/reading-list/:id → update a book
export async function PATCH(req: Request, { params }: { params: {id: string}}) {
    try {
        const updates = await req.json()

        const updated = await prisma.book.update({
            where: { id: params.id },
            data: updates,
        })

        return NextResponse.json({ success: true, data: updated})
    } catch (error) {
        const handled = handlePrismaNotFound(error)
        if (handled) return handled

        console.log("PATCH /entries/:id error: ", error)
        return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
    }
}

// DELETE /api/reading-list/:id → remove a book
export async function DELETE(req: Request, { params }: { params: { id: string }}) {
    try {
        const deleted = await prisma.book.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true, data: deleted });
    } catch (error) {
        const handled = handlePrismaNotFound(error)
        if (handled) return handled
        
        console.error("DELETE /entries/:id error: ", error)
        return NextResponse.json({ error: "Failed to delete entry"}, { status: 500 });
    }
}