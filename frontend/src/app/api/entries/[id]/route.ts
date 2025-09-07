import { prisma } from "@lib/prisma";
import { Book, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { handlePrismaNotFound } from "@/lib/apiResponse";

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
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json()

    const { title, author, status, startedAt, finishedAt } = body
    // Use Partial to allow optional properties
    const data: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">> = {};
    if (title !== undefined) data.title = title
    if (author !== undefined) data.author = author
    if (status !== undefined) data.status = status
    if (startedAt !== undefined) {
      data.startedAt = startedAt ? new Date(startedAt) : null
    }
    if (finishedAt !== undefined) {
      data.finishedAt = finishedAt ? new Date(finishedAt) : null
    }

    const { id } = await context.params 
    const updatedBook = await prisma.book.update({
      where: { id },
      data
    })

    return NextResponse.json(updatedBook, { status: 200})
  } catch (error) {
    console.log("PATCH /api/entries/:id error: ", error)
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