// app/actions/daily-best-trade-actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import Prisma from "@prisma/client";

// Define Zod schema for DailyBestTrade data validation
const DailyBestTradeSchema = z.object({
  id: z.string().optional(), // Optional for create, required for update
  sno: z.coerce.number().int().positive("S.NO must be a positive integer."),
  date: z.string().min(1, "Date is required."),
  strike: z.string().min(1, "Strike is required."),
  
  // For number fields: coerce to number, then handle null, undefined, or NaN (from empty string/non-numeric coercion)
  buyingPrice: z.coerce.number()
    .min(0, "Buying Price must be positive.")
    .nullable() // Allows direct null input
    .transform(val => {
      if (val === null || val === undefined) {
        return 0; // Treat explicit null/undefined as 0
      }
      if (isNaN(val)) { // Check for NaN (result of '' or non-numeric string coercion)
        return 0;
      }
      return val;
    }),
  
  exitPrice: z.coerce.number()
    .min(0, "Exit Price must be positive.")
    .nullable()
    .transform(val => {
      if (val === null || val === undefined) {
        return 0;
      }
      if (isNaN(val)) {
        return 0;
      }
      return val;
    }),
  
  // For optional string fields: transform empty string to null
  target: z.string().nullable().transform(val => val === '' ? null : val).optional(),
  high: z.string().nullable().transform(val => val === '' ? null : val).optional(),
  profitLoss: z.string().nullable().transform(val => val === '' ? null : val).optional(),

  // For totalPoints: similar number handling, but also optional at the schema level
  totalPoints: z.coerce.number()
    .optional() // Makes the field optional in the parsed data (can be undefined)
    .nullable() // Allows direct null input
    .transform(val => {
      if (val === null || val === undefined) {
        return 0;
      }
      if (isNaN(val)) {
        return 0;
      }
      return val;
    }),
});

type FormState = {
  success: boolean;
  error?: string;
  errors?: {
    sno?: string[];
    date?: string[];
    strike?: string[];
    buyingPrice?: string[];
    exitPrice?: string[];
    target?: string[];
    high?: string[];
    profitLoss?: string[];
    totalPoints?: string[];
  };
};

/**
 * Fetches the latest Daily Best Trade (ordered by date descending).
 * @returns {Promise<{ success: boolean; data?: Prisma.DailyBestTrade | null; error?: string }>}
 */
export async function getDailyBestTrade(): Promise<{ success: boolean; data?: Prisma.DailyBestTrade | null; error?: string }> {
  try {
    const latestTrade = await prisma.dailyBestTrade.findFirst({
      orderBy: {
        date: 'desc', // Assuming date is in a sortable string format (e.g., "YYYY-MM-DD")
                      // If "DD-MM-YYYY", you might need more complex sorting or convert date type to DateTime.
      },
    });
    return { success: true, data: latestTrade };
  } catch (error) {
    console.error("Failed to fetch daily best trade:", error);
    return { success: false, error: "Failed to fetch daily best trade." };
  }
}

/**
 * Creates or updates a Daily Best Trade. It uses upsert based on the 'date' field.
 * If 'id' is provided, it attempts to update that specific record.
 * @param {FormData} formData - The form data containing trade details.
 * @returns {Promise<FormState>}
 */
export async function upsertDailyBestTrade(formData: FormData): Promise<FormState> {
  const data = Object.fromEntries(formData.entries());

  // Use the refined Zod schema for parsing and validation
  const parsed = DailyBestTradeSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    console.error("DailyBestTrade validation errors:", errors);
    return {
      success: false,
      errors: errors as FormState['errors'],
      error: "Validation failed.",
    };
  }

  const { id, ...tradeData } = parsed.data; // Destructure id, rest is validated tradeData

  try {
    let resultTrade;
    if (id) {
      // If an ID is provided, attempt to update that specific record
      resultTrade = await prisma.dailyBestTrade.update({
        where: { id: id },
        data: tradeData,
      });
    } else {
      // If no ID, attempt to upsert (create or update based on 'date' uniqueness)
      resultTrade = await prisma.dailyBestTrade.upsert({
        where: { date: tradeData.date }, // Use date as the unique identifier for upsert
        update: tradeData,
        create: tradeData,
      });
    }

    // Revalidate the public dashboard/market page and possibly the admin page
    revalidatePath("/dashboard/market");
    // If your admin page where the tabs are is on a different path, add that here too
    // e.g., revalidatePath("/admin/trades-manager"); 

    return { success: true };
  } catch (e: any) {
    console.error("Failed to upsert daily best trade:", e);
    // Handle unique constraint error for 'date' field
    if (e.code === 'P2002' && e.meta?.target?.includes('date')) {
      return { success: false, error: `A Daily Best Trade for the date "${tradeData.date}" already exists. Please edit the existing one.` };
    }
    return { success: false, error: "An unexpected error occurred while saving the daily best trade." };
  }
}