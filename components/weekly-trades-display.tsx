// components/weekly-trades-display.tsx
"use client"; 

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Corrected import path for Prisma types (consistent with your project structure)
import { Prisma } from '@/lib/generated/prisma'; 

// Define the type for a single trade using Prisma's generated types
type TradeType = Prisma.TradeGetPayload<{}>;

// Define the props interface for WeeklyTradesDisplay
interface WeeklyTradesDisplayProps {
  trades: TradeType[]; // This component now explicitly expects 'trades' as a prop
}

// This component is purely presentational. It receives 'trades' as a prop and renders the table.
export function WeeklyTradesDisplay({ trades }: WeeklyTradesDisplayProps) {
  if (!trades || trades.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No weekly trade data available yet.
      </p>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[80px]">S.NO</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Strike</TableHead>
            <TableHead>Buying Price</TableHead>
            <TableHead>Exit Price</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>High</TableHead>
            <TableHead>Profit/Loss</TableHead>
            <TableHead className="text-right">Total Points</TableHead>
            {/* No Actions column here, as this is purely for display on the landing page */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id} className="hover:bg-accent">
              <TableCell className="font-medium">{trade.sno}</TableCell>
              <TableCell>{trade.date}</TableCell>
              <TableCell>{trade.strike}</TableCell>
              <TableCell>{trade.buyingPrice.toFixed(2)}</TableCell>
              <TableCell>{trade.exitPrice.toFixed(2)}</TableCell>
              <TableCell>{trade.target || 'N/A'}</TableCell>
              <TableCell>{trade.high || 'N/A'}</TableCell>
              <TableCell
                className={
                  trade.profitLoss === 'PROFIT' ? 'text-green-500' : 'text-red-500'
                }
              >
                {trade.profitLoss || 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                {trade.totalPoints ? trade.totalPoints.toFixed(2) : 'N/A'}
              </TableCell>
              {/* No Actions buttons here */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}