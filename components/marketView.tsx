// components/marketView.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WeeklyTradesDisplay } from "@/components/weekly-trades-display";
import { TodayBestTradeDisplay } from "@/components/today-best-trade-display";
import { useEffect, useState } from 'react';
import { getTrades } from '@/app/actions/trade-actions';
import { Prisma } from '@prisma/client';

type TradeType = Prisma.TradeGetPayload<{}>;

export function MarketView() {
  const [marketTrades, setMarketTrades] = useState<TradeType[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(true);
  const [errorTrades, setErrorTrades] = useState<string | null>(null);
  const [activeReturnTab, setActiveReturnTab] = useState("daily"); // State for nested returns tabs

  useEffect(() => {
    const fetchMarketTrades = async () => {
      try {
        setLoadingTrades(true);
        const result = await getTrades();
        if (result.success) {
          setMarketTrades(result.data);
        } else {
          // Changed to display the specific error from the result
          setErrorTrades(result.error || 'Failed to fetch market trades.');
        }
      } catch (err) {
        setErrorTrades('An unexpected error occurred while fetching market trades.');
        console.error("Error fetching market trades:", err);
      } finally {
        setLoadingTrades(false);
      }
    };
    fetchMarketTrades();
  }, []);

  // Placeholder data for Accuracy
  const ACCURACY_DATA = [
    { metric: "Winning Trades", value: "85%", details: "Out of total trades" },
    { metric: "Average Profit per Trade", value: "₹500", details: "Estimated average" },
    { metric: "Strike Rate", value: "70%", details: "Percentage of successful strikes" },
  ];

  // Placeholder data for Returns - Daily (8-12%)
  const DAILY_RETURNS_DATA = [
    { metric: "Expected Range", value: "8-12%", details: "Daily returns" },
    { metric: "Last 7 Days Average", value: "9.5%", details: "Based on recent performance" },
    { metric: "Total Daily Trades", value: "5-10", details: "Average number of trades" },
  ];

  // Placeholder data for Returns - Weekly (correspondingly adjusted)
  const WEEKLY_RETURNS_DATA = [
    { metric: "Expected Range", value: "25-35%", details: "Weekly compounded returns" },
    { metric: "Last 4 Weeks Average", value: "28%", details: "Consistent growth" },
    { metric: "Total Weekly Trades", value: "25-50", details: "Cumulative trades" },
  ];

  // Placeholder data for Returns - Monthly (correspondingly adjusted)
  const MONTHLY_RETURNS_DATA = [
    { metric: "Expected Range", value: "80-120%", details: "Monthly compounded returns" },
    { metric: "Last 3 Months Average", value: "95%", details: "Significant long-term gains" },
    { metric: "Total Monthly Trades", value: "100-200", details: "Overall trading activity" },
  ];

  return (
    <Card className="w-full border border-zinc-800 rounded-lg px-2 sm:px-4 py-4"> {/* Adjusted Card padding for smaller screens */}
      <CardContent className="p-0">
        <Tabs defaultValue="weekly-trades" className="w-full">
          {/* Enhanced TabsList for better responsiveness */}
          <TabsList className="grid w-full grid-cols-2 xs:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 h-auto p-1 mb-4 flex-wrap"> {/* Added xs:grid-cols-4 and flex-wrap as fallback */}
            <TabsTrigger value="weekly-trades" className="py-2 px-2 text-center text-xs sm:text-sm">See Weekly Trades</TabsTrigger> {/* Adjusted font size */}
            <TabsTrigger value="accuracy" className="py-2 px-2 text-center text-xs sm:text-sm">Accuracy</TabsTrigger> {/* Adjusted font size */}
            <TabsTrigger value="returns" className="py-2 px-2 text-center text-xs sm:text-sm">Returns</TabsTrigger> {/* Adjusted font size */}
            <TabsTrigger value="best-trade" className="py-2 px-2 text-center text-xs sm:text-sm">Today&apos;s Best Trade</TabsTrigger> {/* Adjusted font size */}
          </TabsList>

          <TabsContent value="weekly-trades" className="mt-4">
            {loadingTrades ? (
              <p className="text-center text-muted-foreground py-4">Loading weekly trades for overview...</p>
            ) : errorTrades ? (
              // Added word-break-all to handle very long error messages
              <p className="text-center text-red-500 py-4 px-2 text-sm break-words md:break-normal">Error: {errorTrades}</p>
            ) : (
              <WeeklyTradesDisplay trades={marketTrades} />
            )}
          </TabsContent>

          {/* Tab Content for Accuracy (now with table formatting) */}
          <TabsContent value="accuracy" className="mt-4">
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="min-w-[100px]">Metric</TableHead> {/* Added min-width */}
                    <TableHead className="min-w-[80px]">Value</TableHead> {/* Added min-width */}
                    <TableHead className="min-w-[120px]">Details</TableHead> {/* Added min-width */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ACCURACY_DATA.map((item, index) => (
                    <TableRow key={index} className="hover:bg-accent">
                      <TableCell className="font-medium">{item.metric}</TableCell>
                      <TableCell>{item.value}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Tab Content for Returns (now with nested tabs and tables) */}
          <TabsContent value="returns" className="mt-4">
            <Tabs value={activeReturnTab} onValueChange={setActiveReturnTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-4 flex-wrap">
                <TabsTrigger value="daily" className="py-2 px-2 text-center text-xs sm:text-sm">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="py-2 px-2 text-center text-xs sm:text-sm">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" className="py-2 px-2 text-center text-xs sm:text-sm">
                  Monthly
                </TabsTrigger>
              </TabsList>

              <TabsContent value="daily">
                {/* Added overflow-x-auto */}
                <div className="rounded-md border overflow-hidden overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="min-w-[100px]">Metric</TableHead>
                        <TableHead className="min-w-[80px]">Value</TableHead>
                        <TableHead className="min-w-[120px]">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DAILY_RETURNS_DATA.map((item, index) => (
                        <TableRow key={index} className="hover:bg-accent">
                          <TableCell className="font-medium">{item.metric}</TableCell>
                          <TableCell className="text-green-500 font-semibold">{item.value}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{item.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="weekly">
                {/* Added overflow-x-auto */}
                <div className="rounded-md border overflow-hidden overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="min-w-[100px]">Metric</TableHead>
                        <TableHead className="min-w-[80px]">Value</TableHead>
                        <TableHead className="min-w-[120px]">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {WEEKLY_RETURNS_DATA.map((item, index) => (
                        <TableRow key={index} className="hover:bg-accent">
                          <TableCell className="font-medium">{item.metric}</TableCell>
                          <TableCell className="text-green-500 font-semibold">{item.value}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{item.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="monthly">
                {/* Added overflow-x-auto */}
                <div className="rounded-md border overflow-hidden overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="min-w-[100px]">Metric</TableHead>
                        <TableHead className="min-w-[80px]">Value</TableHead>
                        <TableHead className="min-w-[120px]">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MONTHLY_RETURNS_DATA.map((item, index) => (
                        <TableRow key={index} className="hover:bg-accent">
                          <TableCell className="font-medium">{item.metric}</TableCell>
                          <TableCell className="text-green-500 font-semibold">{item.value}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{item.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Tab Content for Today's Best Trade - Now using TodayBestTradeDisplay */}
          <TabsContent value="best-trade" className="mt-4">
            <TodayBestTradeDisplay />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}