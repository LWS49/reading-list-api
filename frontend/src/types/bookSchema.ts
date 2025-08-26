import { z } from "zod";
import { ReadingStatus } from "./book";

export const readingStatusSchema = z.enum(["unread", "reading", "finished"]);

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  author: z.string().optional(),
  status: readingStatusSchema,
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for creating a book (no id/createdAt/updatedAt yet — server sets them)
export const createBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  status: readingStatusSchema.default("unread"),
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
});