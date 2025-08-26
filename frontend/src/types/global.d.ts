import { Book } from "@/types/book";

declare global {
  var readingList: Book[] | undefined;
}