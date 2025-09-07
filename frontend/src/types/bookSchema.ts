import { z } from "zod";
import { ReadingStatus } from "./book";

export const readingStatusSchema = z.enum(["unread", "reading", "finished"]);

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  author: z.string().optional(),
  status: readingStatusSchema,
  startedAt: z.string().optional().refine(
    (val) => !val || !Number.isNaN(new Date(val).getTime()),
      { message: "Invalid date" }
  ),
  finishedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for creating a book (client -> server) (no id/createdAt/updatedAt yet — server sets them)
export const createBookSchema = bookSchema.pick({
  title: true,
  author: true,
  status: true,
  startedAt: true,
  finishedAt: true,
});


// Schema for updating a book (PATCH requests, partial fields allowed)
export const updateBookSchema = createBookSchema.partial();

// Inferred TS types
export type Book = z.infer<typeof bookSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
