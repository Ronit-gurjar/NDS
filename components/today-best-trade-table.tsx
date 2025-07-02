// components/today-best-trade-table.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { PencilLineIcon } from 'lucide-react';
import { type DailyBestTrade as PrismaDailyBestTrade } from '@prisma/client';

// Import common form fields component (assuming it handles fields for both types)
import { TradeFormFields } from './trade-form-fields';

// Import server actions specific to Daily Best Trade
import { getDailyBestTrade, upsertDailyBestTrade } from "@/app/actions/daily-best-trade-actions";

export default function TodayBestTradeTable() {
  const [dailyBestTrade, setDailyBestTrade] = useState<PrismaDailyBestTrade | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const fetchBestTrade = async () => {
    setLoading(true);
    const result = await getDailyBestTrade();
    if (result.success) {
      setDailyBestTrade(result.data ?? null);
    } else {
      toast.error(result.error || "Failed to fetch today's best trade.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBestTrade();
  }, []);

  const handleDailyBestTradeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // If an existing trade is being edited, include its ID
    if (dailyBestTrade?.id) {
      formData.append("id", dailyBestTrade.id);
    }

    startTransition(async () => {
      const result = await upsertDailyBestTrade(formData);

      if (result.success) {
        toast.success(dailyBestTrade ? "Today&apos;s Best Trade updated successfully!" : "Today&apos;s Best Trade added successfully!");
        setIsEditSheetOpen(false); // Close the sheet on success
        fetchBestTrade(); // Refresh the displayed trade
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(`${field}: ${msg}`));
            }
          });
        } else {
          toast.error(result.error || "An error occurred while saving today&apos;s best trade.");
        }
      }
    });
  };

  return (
    <Card className="w-full shadow-lg my-4 border border-zinc-800 rounded-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Today&apos;s Best Trade (Management)</CardTitle>
        <div className="w-full sm:w-auto flex justify-end">
          <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading} className="w-full sm:w-auto">
                <PencilLineIcon className="h-4 w-4 mr-2" />
                {dailyBestTrade ? "Edit Best Trade" : "Set Today&apos;s Best Trade"}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full max-h-screen p-8">
              <SheetHeader>
                <SheetTitle>{dailyBestTrade ? "Edit Today&apos;s Best Trade" : "Set Today&apos;s Best Trade"}</SheetTitle>
                <SheetDescription>
                  {dailyBestTrade ? "Modify the details for today&apos;s best trade." : "Enter the details for today&apos;s best trade. It will replace any existing entry for this date."}
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleDailyBestTradeSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto grid gap-4 py-4 pr-2">
                  {/* Re-use TradeFormFields for consistency */}
                  <TradeFormFields initialData={dailyBestTrade} formIdPrefix="tbt-management" />
                </div>
                <div className="mt-4">
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : "Save Today&apos;s Best Trade"}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm pt-4">
        {loading ? (
          <p className="col-span-full text-center text-muted-foreground py-4">Loading today&apos;s best trade...</p>
        ) : !dailyBestTrade ? (
          <p className="col-span-full text-center text-muted-foreground py-4">No daily best trade set yet. Click &quot;Set Today&apos;s Best Trade&quot; to add one.</p>
        ) : (
          <>
            {/* Display the current Daily Best Trade data */}
            <div className="flex flex-col">
              <span className="text-muted-foreground">S.NO:</span>
              <span className="font-semibold">{dailyBestTrade.sno}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-semibold">{dailyBestTrade.date}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Strike:</span>
              <span className="font-semibold text-emerald-400">{dailyBestTrade.strike}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Buying Price:</span>
              <span className="font-semibold">{dailyBestTrade.buyingPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Exit Price:</span>
              <span className="font-semibold">{dailyBestTrade.exitPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Target:</span>
              <span className="font-semibold">{dailyBestTrade.target || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">High:</span>
              <span className="font-semibold">{dailyBestTrade.high || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Profit/Loss:</span>
              <span
                className={`font-semibold ${
                  dailyBestTrade.profitLoss === 'PROFIT' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {dailyBestTrade.profitLoss || 'N/A'}
              </span>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-3 md:col-span-4">
              <span className="text-muted-foreground">Total Points:</span>
              <span className="font-semibold">{dailyBestTrade.totalPoints ? dailyBestTrade.totalPoints.toFixed(2) : 'N/A'}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}