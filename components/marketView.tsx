// components/marketView.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardTitle, CardDescription as they are handled in page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Added Table imports
import { WeeklyTradesDisplay } from "@/components/weekly-trades-display";
import { useEffect, useState } from 'react';
import { getTrades } from '@/app/actions/trade-actions';
import { Prisma } from '@/lib/generated/prisma';

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

  const todaysBestTrade = {
    sno: 7,
    date: "15-05-2025",
    strike: "NIFTY 24800 CE",
    profitLoss: "PROFIT",
    totalPoints: 30.00,
  };

  return (
    <Card className="w-full border border-zinc-800 rounded-lg px-6 py-4">
      <CardContent className="p-0">
        <Tabs defaultValue="weekly-trades" className="w-full">
          {/* Modified TabsList for responsive wrapping */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-4 h-auto p-1 mb-4"> {/* Added grid, grid-cols-2, md:grid-cols-4, lg:grid-cols-4, h-auto, mb-4 */}
            <TabsTrigger value="weekly-trades" className="py-2 px-4 text-center">See Weekly Trades</TabsTrigger>
            <TabsTrigger value="accuracy" className="py-2 px-4 text-center">Accuracy</TabsTrigger>
            <TabsTrigger value="returns" className="py-2 px-4 text-center">Returns</TabsTrigger>
            <TabsTrigger value="best-trade" className="py-2 px-4 text-center">Today's Best Trade</TabsTrigger> {/* Corrected capitalization */}
          </TabsList>

          <TabsContent value="weekly-trades" className="mt-4">
            {loadingTrades ? (
              <p className="text-center text-muted-foreground py-4">Loading weekly trades for overview...</p>
            ) : errorTrades ? (
              <p className="text-center text-red-500 py-4">Error: {errorTrades}</p>
            ) : (
              <WeeklyTradesDisplay trades={marketTrades} />
            )}
          </TabsContent>

          {/* Tab Content for Accuracy (now with table formatting) */}
          <TabsContent value="accuracy" className="mt-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Details</TableHead>
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
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-4"> {/* Nested tabs are always 3 columns */}
                <TabsTrigger value="daily" className="py-2 px-4 text-center">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="py-2 px-4 text-center">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" className="py-2 px-4 text-center">
                  Monthly
                </TabsTrigger>
              </TabsList>

              <TabsContent value="daily">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Details</TableHead>
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
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Details</TableHead>
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
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Details</TableHead>
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

          {/* Tab Content for Today's Best Trade (now with table formatting) */}
          <TabsContent value="best-trade" className="mt-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>S.NO</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Strike</TableHead>
                    <TableHead>P/L</TableHead>
                    <TableHead className="text-right">Total Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-accent">
                    <TableCell className="font-medium">{todaysBestTrade.sno}</TableCell>
                    <TableCell>{todaysBestTrade.date}</TableCell>
                    <TableCell>{todaysBestTrade.strike}</TableCell>
                    <TableCell
                      className={
                        todaysBestTrade.profitLoss === 'PROFIT' ? 'text-green-500' : 'text-red-500'
                      }
                    >
                      {todaysBestTrade.profitLoss}
                    </TableCell>
                    <TableCell className="text-right">{todaysBestTrade.totalPoints.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}