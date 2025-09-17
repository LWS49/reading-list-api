"use client"

import { useEffect, useState } from "react"
import { Book } from "@/types/book"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link"

export default function EntriesPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("")
    const [searchInput, setSearchInput] = useState("")
    const [status, setStatus] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        async function fetchBooks() {
            try {
                setLoading(true)
                const query = new URLSearchParams({
                    search, 
                    status, 
                    page: page.toString(),
                    limit: "5",
                }).toString()

                const res = await fetch(`/api/entries?${query}`);
                if (!res.ok) throw new Error("Failed to fetch entries");
                
                const { data, pagination } = await res.json();
                setBooks(data)
                setTotalPages(pagination.totalPages)
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("Something went wrong");
                }
                console.log(e);
            } finally {
                setLoading(false)
            }
        }
        fetchBooks()
    }, [search, status, page])

    async function handleDelete(id: string) {
        const res = await fetch(`api/entries/${id}`, {
            method: "DELETE"
        })
        if (res.ok) {
            setBooks(books.filter(book => book.id !== id))
        } else {
            alert("Failed to delete entry")
        }
    }
    
    if (loading) {
        return <p className="p-6 text-gray-600">Loading entries...</p>;
    }

    if (error) {
        return (
            <div className="p-6 text-red-600">
                <p>⚠️ {error}</p>
            </div>
        );
    }

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

            {/* Search + Filter */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput} 
                    onChange={e => setSearchInput(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                />
                <button
                    onClick={() => setSearch(searchInput)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Search
                </button>
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All</option>
                    <option value="unread">Unread</option>
                    <option value="reading">Reading</option>
                    <option value="finished">Finished</option>
                </select>
            </div>

            {books.length === 0 ? (
                <p className="text-gray-600">No entries yet. Make your own book!</p>
            ) : (
                <ul className="space-y-4">
                    {books.map((book) => (
                        <Card key={book.id} className="shadow-sm">
                            <CardHeader>
                                <Link href={`/entries/${book.id}`}>
                                    <CardTitle>{book.title}</CardTitle>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {book.author && (
                                    <p className="text-sm text-gray-700">{book.author}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Status: {book.status} · Created{" "}
                                    {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Unknown date"}
                                </p>
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </ul>
            )}

            {/* Pagination */}
            <div>
                <button
                    disabled = {page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}