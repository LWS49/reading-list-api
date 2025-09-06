import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export function handlePrismaNotFound(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return null; // Not handled here
}