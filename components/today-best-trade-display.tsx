// components/today-best-trade-display.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DailyBestTrade as PrismaDailyBestTrade } from '@prisma/client';
import { getDailyBestTrade } from "@/app/actions/daily-best-trade-actions"; // Only import the get action

export function TodayBestTradeDisplay() {
  const [dailyBestTrade, setDailyBestTrade] = useState<PrismaDailyBestTrade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestTrade = async () => {
      setLoading(true);
      setError(null);
      const result = await getDailyBestTrade();
      if (result.success) {
        setDailyBestTrade(result.data ?? null);
      } else {
        setError(result.error || "Failed to fetch today&apos;s best trade."); // Escaped apostrophe
      }
      setLoading(false);
    };

    fetchBestTrade();
  }, []);

  if (loading) {
    return (
      <Card className="w-full shadow-lg my-4 border border-zinc-800 rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Today&apos;s Best Trade</CardTitle> {/* Escaped apostrophe */}
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-4">
          Loading today&apos;s best trade... {/* Escaped apostrophe */}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full shadow-lg my-4 border border-zinc-800 rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Today&apos;s Best Trade</CardTitle> {/* Escaped apostrophe */}
        </CardHeader>
        <CardContent className="text-center text-red-500 py-4">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg my-4 border border-zinc-800 rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Today&apos;s Best Trade</CardTitle> {/* Escaped apostrophe */}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm pt-4">
        {!dailyBestTrade ? (
          <p className="col-span-2 text-center text-muted-foreground py-4">No daily best trade set yet.</p>
        ) : (
          <>
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
            <div className="flex flex-col col-span-2">
              <span className="text-muted-foreground">Total Points:</span>
              <span className="font-semibold">{dailyBestTrade.totalPoints ? dailyBestTrade.totalPoints.toFixed(2) : 'N/A'}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TodayBestTradeDisplay;