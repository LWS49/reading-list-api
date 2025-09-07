"use client"

import { useState } from "react"
import { Book } from "@/types/book"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EntryClient({ entry }: { entry: Book }){
     console.log("EntryClient received entry:", entry)
    const [book, setBook] = useState(entry)
    const [saving, setSaving] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        /* 
        e is the event object that gets passed to all event handlers in React.
        React.FormEvent<HTMLFormElement> is its type - this tells TypeScript: "This event came from a <form> element."

        e.preventDefault() prevents the browser's default form submission behavior.
        Without this, the browser would:
        - Try to send the form data via an HTTP request (usually a page reload).
        - You would lose all React state and end up with a full-page refresh.
        Since I'm handling form submission with JavaScript and React, I don't want that.
        */
        
        e.preventDefault()
        setSaving(true)

        const formData = new FormData(e.currentTarget)
        const updates = {
            title: formData.get("title"),
            author: formData.get("author"),
            status: formData.get("status"),
            startedAt: formData.get("startedAt") || null,
            finishedAt: formData.get("finishedAt") || null,
        }

        const res = await fetch(`/api/entries/${book.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        })

        if (res.ok) {
            const updated = await res.json()
            setBook(updated)
            alert("Changes saved!")
        } else {
            alert("Failed to save changes")
        }

        setSaving(false)
    }

    if (!entry) return <p>Loading...</p>
    return (
        <div className="p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                    type="text"
                    name="title"
                    defaultValue={book.title}
                    className="border px-2 py-1 w-full rounded" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Author</label>
                <input 
                    type="text"
                    name="author"
                    defaultValue={book.author ?? ""}
                    className="border px-2 py-1 w-full rounded"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                    name="status"
                    defaultValue={book.status}
                    className="border px-2 py-1 w-full rounded"
                >
                    <option value="unread">Unread</option>
                    <option value="reading">Reading</option>
                    <option value="finished">Finished</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium">Started At</label>
                <input
                    type="date"
                    name="startedAt"
                    defaultValue={book.startedAt ? book.startedAt.split("T")[0] : ""}
                    className="border px-2 py-1 w-full rounded" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium">Finished At</label>
                <input
                    type="date"
                    name="finishedAt"
                    defaultValue={book.finishedAt ? book.finishedAt.split("T")[0] : ""}
                    className="border px-2 py-1 w-full rounded"
                />
            </div>

            <div className="flex gap-4">
                <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
                <Link
                    href="/entries"
                    className="inline-block text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                    Return to Entries
                </Link>
            </div>
        </form>
        </div>
    )
}