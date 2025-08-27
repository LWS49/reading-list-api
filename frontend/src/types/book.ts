export type ReadingStatus = "unread" | "reading" | "finished";

export interface Book {
  id: string;          // unique identifier (uuid)
  title: string;       // book/article title
  author?: string;     // optional
  status: ReadingStatus;
  startedAt?: string;  // ISO date
  finishedAt?: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

/*
types/book.ts → defines the domain type (Book interface, ReadingStatus union, etc.).

Pure TypeScript, no runtime checks.
Used everywhere in your app for typing.

Contrasted with types/bookSchema.ts, which defines the runtime validator.
*/