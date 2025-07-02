// components/weekly-trade-table.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, PlusCircle, RotateCcw, PencilLineIcon } from 'lucide-react';

import { type Trade as PrismaTrade } from '@prisma/client'; // Only import Trade type

// Import common form fields component
import { TradeFormFields } from './trade-form-fields';

// Import server actions for only Trade
import { getTrades, createTrade, updateTrade, deleteTrade, deleteAllTrades } from "@/app/actions/trade-actions";

export default function WeeklyTradeTable() {
  const [trades, setTrades] = useState<PrismaTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // States for Trade management
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<PrismaTrade | null>(null);
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);
  const [showUpdateReminder, setShowUpdateReminder] = useState(false);

  // --- Data Fetching Function ---
  const fetchTrades = async () => {
    setLoading(true);
    const result = await getTrades();
    if (result.success) {
      setTrades(result.data);
    } else {
      toast.error(result.error || "Failed to fetch weekly trades.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  // Reminder Logic (remains unchanged)
  useEffect(() => {
    const lastUpdateDate = localStorage.getItem('lastTradeUpdate');
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 6 for Saturday

    if (dayOfWeek === 0) { // If it's Sunday
      if (!lastUpdateDate || new Date(lastUpdateDate).setHours(0,0,0,0) < today.setHours(0,0,0,0)) {
        setShowUpdateReminder(true);
      } else {
        setShowUpdateReminder(false);
      }
    } else {
      setShowUpdateReminder(false);
    }
  }, [isPending]); // Re-run reminder check if any action is pending

  // --- Handlers for Weekly Trades ---
  const handleTradeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (editingTrade) {
      formData.append("id", editingTrade.id);
    }

    startTransition(async () => {
      let result;
      if (editingTrade) {
        result = await updateTrade(formData);
      } else {
        result = await createTrade(formData);
      }

      if (result.success) {
        toast.success(editingTrade ? "Trade updated successfully!" : "Trade added successfully!");
        setIsAddSheetOpen(false);
        setIsEditSheetOpen(false);
        setEditingTrade(null);
        fetchTrades(); // Refresh weekly trades
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => toast.error(`${field}: ${msg}`));
            }
          });
        } else {
          toast.error(result.error || "An error occurred.");
        }
      }
    });
  };

  const handleTradeDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTrade(id);
      if (result.success) {
        toast.success("Trade deleted successfully!");
        fetchTrades(); // Refresh weekly trades
      } else {
        toast.error(result.error || "Failed to delete trade.");
      }
    });
  };

  const handleAllTradesDelete = () => {
    startTransition(async () => {
      const result = await deleteAllTrades();
      if (result.success) {
        toast.success("All weekly trades deleted successfully!");
        localStorage.setItem('lastTradeUpdate', new Date().toISOString());
        setShowUpdateReminder(false);
        fetchTrades(); // Refresh weekly trades
        setIsDeleteAllConfirmOpen(false);
      } else {
        toast.error(result.error || "Failed to delete all trades.");
      }
    });
  };

  return (
    <Card className="w-full shadow-lg my-8 border border-zinc-800 rounded-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-2">
        <CardTitle className="text-xl font-bold whitespace-nowrap">Weekly Trade Management</CardTitle>

        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto justify-end">
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <PlusCircle className="h-4 w-4 mr-2 sm:mr-1" />
                <span className="hidden xs:inline">Add New Trade</span>
                <span className="inline xs:hidden">Add Trade</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full max-h-screen p-8">
              <SheetHeader>
                <SheetTitle>Add New Weekly Trade</SheetTitle>
                <SheetDescription>Enter the details for the new weekly trade.</SheetDescription>
              </SheetHeader>
              <form onSubmit={handleTradeSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto grid gap-4 py-4 pr-2">
                  <TradeFormFields formIdPrefix="weekly-trade" />
                </div>
                <div className="mt-4">
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Adding..." : "Add Trade"}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>

          <Dialog open={isDeleteAllConfirmOpen} onOpenChange={setIsDeleteAllConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-2 sm:mr-1" />
                <span className="hidden xs:inline">Delete All Weekly Trades</span>
                <span className="inline xs:hidden">Delete All</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete all weekly trade data.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteAllConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleAllTradesDelete} disabled={isPending}>
                  {isPending ? "Deleting..." : "Confirm Delete All"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      {showUpdateReminder && (
        <p className="text-red-500 text-sm mt-2 px-6">
          Reminder: Please update the trade data this weekend! <RotateCcw className="inline h-4 w-4 ml-1" />
        </p>
      )}
      <Separator />

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-muted-foreground py-4">Loading weekly trade data...</p>
          ) : trades.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No weekly trade data available. Add a new trade!</p>
          ) : (
            <Table className="min-w-full divide-y divide-zinc-800">
              {/* Removed whitespace here */}
              <TableHeader className="bg-zinc-800 text-muted-foreground">
                <TableRow>
                  <TableHead className="w-[50px] px-4 py-3 text-left">S.NO</TableHead>
                  <TableHead className="min-w-[120px] px-4 py-3 text-left">Date</TableHead>
                  <TableHead className="min-w-[180px] px-4 py-3 text-left">Strike</TableHead>
                  <TableHead className="min-w-[120px] px-4 py-3 text-right">Buying Price</TableHead>
                  <TableHead className="min-w-[120px] px-4 py-3 text-right">Exit Price</TableHead>
                  <TableHead className="min-w-[100px] px-4 py-3 text-left">Target</TableHead>
                  <TableHead className="min-w-[100px] px-4 py-3 text-left">High</TableHead>
                  <TableHead className="min-w-[120px] px-4 py-3 text-left">Profit/Loss</TableHead>
                  <TableHead className="min-w-[120px] text-right px-4 py-3">Total Points</TableHead>
                  <TableHead className="min-w-[80px] text-right px-4 py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>{/* Removed whitespace here */}
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="font-medium px-4 py-2">{trade.sno}</TableCell>
                    <TableCell className="px-4 py-2">{trade.date}</TableCell>
                    <TableCell className="text-emerald-400 px-4 py-2">{trade.strike}</TableCell>
                    <TableCell className="px-4 py-2 text-right">{trade.buyingPrice.toFixed(2)}</TableCell>
                    <TableCell className="px-4 py-2 text-right">{trade.exitPrice.toFixed(2)}</TableCell>
                    <TableCell className="px-4 py-2">{trade.target || 'N/A'}</TableCell>
                    <TableCell className="px-4 py-2">{trade.high || 'N/A'}</TableCell>
                    <TableCell
                      className={
                        trade.profitLoss === 'PROFIT' ? 'text-green-500 px-4 py-2' : 'text-red-500 px-4 py-2'
                      }
                    >
                      {trade.profitLoss || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right px-4 py-2">
                      {trade.totalPoints ? trade.totalPoints.toFixed(2) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-1 px-4 py-2">
                      <Sheet open={isEditSheetOpen && editingTrade?.id === trade.id} onOpenChange={(open) => {
                        setIsEditSheetOpen(open);
                        if (!open) setEditingTrade(null);
                      }}>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingTrade(trade);
                              setIsEditSheetOpen(true);
                            }}
                          >
                            <PencilLineIcon className="h-4 w-4 text-blue-500" />
                            <span className="sr-only">Edit Trade</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="flex flex-col h-full max-h-screen p-8">
                          <SheetHeader>
                            <SheetTitle>Edit Weekly Trade</SheetTitle>
                            <SheetDescription>
                              Modify the details for this weekly trade.
                            </SheetDescription>
                          </SheetHeader>
                          <form onSubmit={handleTradeSubmit} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto grid gap-4 py-4 pr-2">
                              <TradeFormFields initialData={editingTrade} formIdPrefix="edit-weekly-trade" />
                            </div>
                            <div className="mt-4">
                              <Button type="submit" disabled={isPending} className="w-full">
                                {isPending ? "Updating..." : "Save Changes"}
                              </Button>
                            </div>
                          </form>
                        </SheetContent>
                      </Sheet>

                      <Button variant="ghost" size="icon" onClick={() => handleTradeDelete(trade.id)} disabled={isPending}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete Trade</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}