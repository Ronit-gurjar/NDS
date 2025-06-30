// app/actions/trade-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from '@/lib/generated/prisma'; // Corrected path
// ...
type PrismaTrade = Prisma.TradeGetPayload<{}>;


// --- Zod Schemas for Input Validation ---
const baseTradeSchema = z.object({
  sno: z.coerce.number().int().positive("S.NO must be a positive integer"),
  date: z.string().min(1, "Date is required"),
  strike: z.string().min(1, "Strike is required"),
  buyingPrice: z.coerce.number().nonnegative("Buying Price must be a non-negative number"),
  exitPrice: z.coerce.number().nonnegative("Exit Price must be a non-negative number"),
  target: z.string().nullable().optional(),
  high: z.string().nullable().optional(),
  profitLoss: z.string().nullable().optional(),
  totalPoints: z.coerce.number().nullable().optional(),
});

const createTradeSchema = baseTradeSchema;

const updateTradeSchema = baseTradeSchema.partial().extend({
  id: z.string().min(1, "ID is required for update"),
});

// --- Standardized Server Action Response Type ---
type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; errors?: Record<string, string[]> };

// --- Server Actions ---

export async function createTrade(formData: FormData): Promise<ActionResponse<PrismaTrade>> {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const processedFormData = {
        ...rawFormData,
        target: rawFormData.target === '' ? null : rawFormData.target,
        high: rawFormData.high === '' ? null : rawFormData.high,
        profitLoss: rawFormData.profitLoss === '' ? null : rawFormData.profitLoss,
        totalPoints: rawFormData.totalPoints === '' ? null : rawFormData.totalPoints,
    };

    const validatedData = createTradeSchema.safeParse(processedFormData);

    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      const errorMessage = Object.entries(fieldErrors)
        .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
        .join("; ");
      return { success: false, error: `Validation failed: ${errorMessage}`, errors: fieldErrors };
    }

    const newTrade = await prisma.trade.create({
      data: validatedData.data as any, // Added 'as any' as a temporary measure if Zod schema doesn't perfectly align with Prisma create input types. Ideally, this should match without 'any'.
    });

    revalidatePath("/dashboard/market");
    revalidatePath("/");
    return { success: true, data: newTrade };
  } catch (error: any) {
    console.error("Error creating trade:", error);
    return { success: false, error: "Failed to create trade." };
  }
}

export async function getTrades(): Promise<ActionResponse<PrismaTrade[]>> {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return { success: true, data: trades };
  } catch (error: any) {
    console.error("Error fetching trades:", error);
    return { success: false, error: "Failed to fetch trades." };
  }
}

export async function updateTrade(formData: FormData): Promise<ActionResponse<PrismaTrade>> {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const processedFormData = {
        ...rawFormData,
        target: rawFormData.target === '' ? null : rawFormData.target,
        high: rawFormData.high === '' ? null : rawFormData.high,
        profitLoss: rawFormData.profitLoss === '' ? null : rawFormData.profitLoss,
        totalPoints: rawFormData.totalPoints === '' ? null : rawFormData.totalPoints,
    };

    const validatedData = updateTradeSchema.safeParse(processedFormData);

    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      const errorMessage = Object.entries(fieldErrors)
        .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
        .join("; ");
      return { success: false, error: `Validation failed: ${errorMessage}`, errors: fieldErrors };
    }

    const { id, ...updatePayload } = validatedData.data;

    if (!id) {
        return { success: false, error: "Trade ID is missing for update." };
    }

    const updatedTrade = await prisma.trade.update({
      where: { id: id },
      data: updatePayload as any, // Added 'as any' here too for consistency with create.
    });

    revalidatePath("/dashboard/market");
    revalidatePath("/");
    return { success: true, data: updatedTrade };
  } catch (error: any) {
    console.error("Error updating trade:", error);
    return { success: false, error: "Failed to update trade." };
  }
}

export async function deleteTrade(id: string): Promise<ActionResponse<null>> {
  try {
    await prisma.trade.delete({
      where: { id },
    });
    revalidatePath("/dashboard/market");
    revalidatePath("/");
    return { success: true, data: null };
  } catch (error: any) {
    console.error("Error deleting trade:", error);
    return { success: false, error: "Failed to delete trade." };
  }
}

export async function deleteAllTrades(): Promise<ActionResponse<null>> {
  try {
    await prisma.trade.deleteMany({});
    revalidatePath("/dashboard/market");
    revalidatePath("/");
    return { success: true, data: null };
  } catch (error: any) {
    console.error("Error deleting all trades:", error);
    return { success: false, error: "Failed to delete all trades." };
  }
}