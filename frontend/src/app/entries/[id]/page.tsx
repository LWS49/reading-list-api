import { notFound } from "next/navigation"
import { Book } from "@/types/book"
import EntryClient from "./EntryClient.tsx"

// cache: "no-store" prevents caching (ensures fresh data on every request).
async function getEntry(id: string): Promise<Book | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/entries/${id}`, {cache: "no-store"})
    if (!res.ok) return null
    
    const data = await res.json()
    return data.book as Book
}

// page must be default export!
export default async function EntryPage( context: { params: Promise<{ id: string }> }){
    const { id } = await context.params
    
    const entry = await getEntry(id)
    if (!entry) notFound()
    return <EntryClient entry={entry} />
}