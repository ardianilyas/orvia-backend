import { db } from "@/shared/db";
import { tickets } from "@/shared/db/schemas";
import { sql } from "drizzle-orm";

function formatTicketCode(prefix: string, number: number): string {
  const paddedNumber = number.toString().padStart(3, "0");
  return `${prefix}-${paddedNumber}`;
}

function extractTicketNumber(ticketCode: string): number {
  const parts = ticketCode.split("-");
  const numberPart = parts[parts.length - 1];
  return parseInt(numberPart || "0", 10);
}

export async function generateTicketCode(prefix: string): Promise<string> {
  const prefixPattern = `${prefix}-%`;

  const [result] = await db
    .select({ ticketNumber: tickets.ticketNumber })
    .from(tickets)
    .where(sql`${tickets.ticketNumber} LIKE ${prefixPattern}`)
    .orderBy(sql`LENGTH(${tickets.ticketNumber}) DESC, ${tickets.ticketNumber} DESC`)
    .limit(1);

  const highestNumber = result ? extractTicketNumber(result.ticketNumber) : 0;
  const nextNumber = highestNumber + 1;

  return formatTicketCode(prefix, nextNumber);
}
