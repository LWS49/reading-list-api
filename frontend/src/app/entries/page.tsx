"use client"

import { useEffect, useState } from "react"
import { Book } from "@/types/book"
import Link from "next/link"

export default function EntriesPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBooks() {
            try {
                const res = await fetch("api/books")
                if (!res.ok) throw new Error("failed to fetch")
                const data = await res.json()
                setBooks(data)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [])

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-bold text-2xl">Entries</h1>
                <Link
                    href="/entries/new"
                    className="text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700"
                >
                    New Entry
                </Link>
            </div>

            {books.length === 0 ? (
                <p>No entries yet. Make your own book!</p>
            ) : (
                <ul className="space-y-4">
                    {books.map((book) => (
                        <li
                            key={book.id}
                            className="border rounded-lg bg-white"
                        >
                            <h2 className="font-semibold">{book.title}</h2>
                            <p className="text-sm text-gray-600">{book.author}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}