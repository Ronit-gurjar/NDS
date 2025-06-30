// components/weekly-trade-table.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, PlusCircle, RotateCcw, PencilLineIcon } from 'lucide-react';

import { type Trade as PrismaTrade } from '@/lib/generated/prisma';

import { getTrades, createTrade, updateTrade, deleteTrade, deleteAllTrades } from "@/app/actions/trade-actions";

export default function WeeklyTradeTable() {
  const [trades, setTrades] = useState<PrismaTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<PrismaTrade | null>(null);
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false);

  const [showUpdateReminder, setShowUpdateReminder] = useState(false);

  const fetchTrades = async () => {
    setLoading(true);
    const result = await getTrades();
    if (result.success) {
      setTrades(result.data);
    } else {
      toast.error(result.error || "Failed to fetch trades.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

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
  }, [isPending]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        setIsAddSheetOpen(false); // Close the sheet on success
        setIsEditSheetOpen(false);
        setEditingTrade(null);
        fetchTrades();
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

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTrade(id);
      if (result.success) {
        toast.success("Trade deleted successfully!");
        fetchTrades();
      } else {
        toast.error(result.error || "Failed to delete trade.");
      }
    });
  };

  const handleDeleteAll = () => {
    startTransition(async () => {
      const result = await deleteAllTrades();
      if (result.success) {
        toast.success("All trades deleted successfully!");
        localStorage.setItem('lastTradeUpdate', new Date().toISOString());
        setShowUpdateReminder(false);
        fetchTrades();
        setIsDeleteAllConfirmOpen(false);
      } else {
        toast.error(result.error || "Failed to delete all trades.");
      }
    });
  };

  const TradeFormFields = ({ initialData }: { initialData?: PrismaTrade | null }) => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="sno">S.NO</Label>
        <Input id="sno" name="sno" type="number" required defaultValue={initialData?.sno || ''} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="text" placeholder="e.g., 12-05-2025" required defaultValue={initialData?.date || ''} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="strike">Strike</Label>
        <Input id="strike" name="strike" type="text" required defaultValue={initialData?.strike || ''} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="buyingPrice">Buying Price</Label>
        <Input id="buyingPrice" name="buyingPrice" type="number" step="0.01" required defaultValue={initialData?.buyingPrice || ''} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="exitPrice">Exit Price</Label>
        <Input id="exitPrice" name="exitPrice" type="number" step="0.01" required defaultValue={initialData?.exitPrice || ''} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="target">Target</Label>
        <Input id="target" name="target" type="text" defaultValue={initialData?.target || ''} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="high">High</Label>
        <Input id="high" name="high" type="text" defaultValue={initialData?.high || ''} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="profitLoss">Profit/Loss</Label>
        <Input id="profitLoss" name="profitLoss" type="text" placeholder="PROFIT / LOSS" defaultValue={initialData?.profitLoss || ''} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="totalPoints">Total Points</Label>
        <Input id="totalPoints" name="totalPoints" type="number" step="0.01" defaultValue={initialData?.totalPoints || ''} />
      </div>
    </>
  );

  return (
    <Card className="w-full shadow-lg my-8 border border-zinc-800 rounded-lg">
      <CardHeader>
        {/* Adjusted Header: flex for alignment, space-x for gaps, and items-center for vertical centering */}
        <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
          <CardTitle className="text-xl font-bold whitespace-nowrap">Weekly Trade Data</CardTitle>

          {/* Button Group: flex-wrap on mobile, no wrapping on sm+ */}
          <div className="flex flex-wrap justify-end gap-2 sm:gap-4 ml-auto">
            {/* Add New Trade Button */}
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-grow sm:flex-none" // flex-grow to fill available space on mobile row/wrap, flex-none on desktop
                >
                  <PlusCircle className="h-4 w-4 mr-2 sm:mr-0" /> {/* Icon always visible, mr-2 only when text is next to it */}
                  <span className="hidden sm:inline">Add New Trade</span> {/* Full text on sm+ */}
                  <span className="inline sm:hidden">Add Trade</span> {/* Short text on mobile, or can make icon-only */}
                </Button>
              </SheetTrigger>
              {/* === ADD NEW TRADE SHEET CONTENT MODIFICATION === */}
              <SheetContent className="flex flex-col h-full max-h-screen p-8"> {/* Added h-full and max-h-screen */}
                <SheetHeader>
                  <SheetTitle>Add New Trade</SheetTitle>
                  <SheetDescription>
                    Enter the details for the new weekly trade.
                  </SheetDescription>
                </SheetHeader>
                {/* The form itself is a flex container that grows to fill remaining space */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0"> {/* Added flex-1 and min-h-0 */}
                  {/* This div contains the scrollable form fields */}
                  <div className="flex-1 overflow-y-auto grid gap-4 py-4 pr-2"> {/* This is the scrollable area */}
                    <TradeFormFields />
                  </div>
                  {/* The submit button, which stays fixed at the bottom */}
                  <div className="mt-4">
                    <Button type="submit" disabled={isPending} className="w-full">
                      {isPending ? "Adding..." : "Add Trade"}
                    </Button>
                  </div>
                </form>
              </SheetContent>
              {/* ============================================== */}
            </Sheet>

            {/* Delete All Button with Confirmation Dialog */}
            <Dialog open={isDeleteAllConfirmOpen} onOpenChange={setIsDeleteAllConfirmOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-grow sm:flex-none" // flex-grow to fill available space on mobile row/wrap, flex-none on desktop
                >
                  <Trash2 className="h-4 w-4 mr-2 sm:mr-0" /> {/* Icon always visible, mr-2 only when text is next to it */}
                  <span className="hidden sm:inline">Delete All</span> {/* Full text on sm+ */}
                  <span className="inline sm:hidden">Delete</span> {/* Short text on mobile, or can make icon-only */}
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
                  <Button variant="destructive" onClick={handleDeleteAll} disabled={isPending}>
                    {isPending ? "Deleting..." : "Confirm Delete All"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {showUpdateReminder && (
          <p className="text-red-500 text-sm mt-2">
            Reminder: Please update the trade data this weekend! <RotateCcw className="inline h-4 w-4 ml-1" />
          </p>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="overflow-x-auto p-0">
        {loading ? (
          <p className="text-center text-muted-foreground py-4">Loading trade data...</p>
        ) : trades.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No weekly trade data available. Add a new trade!</p>
        ) : (
          <Table className="min-w-full">
            <TableHeader className="bg-zinc-800 text-muted-foreground">
              <TableRow>
                <TableHead className="w-[50px] px-4 py-2">S.NO</TableHead>
                <TableHead className="px-4 py-2">Date</TableHead>
                <TableHead className="px-4 py-2">Strike</TableHead>
                <TableHead className="px-4 py-2">Buying Price</TableHead>
                <TableHead className="px-4 py-2">Exit Price</TableHead>
                <TableHead className="px-4 py-2">Target</TableHead>
                <TableHead className="px-4 py-2">High</TableHead>
                <TableHead className="px-4 py-2">Profit/Loss</TableHead>
                <TableHead className="text-right px-4 py-2">Total Points</TableHead>
                <TableHead className="w-[100px] text-right px-4 py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="px-2">
              {trades.map((trade) => (
                <TableRow key={trade.id} className="border-b border-zinc-800">
                  <TableCell className="font-medium px-4 py-2">{trade.sno}</TableCell>
                  <TableCell className="px-4 py-2">{trade.date}</TableCell>
                  <TableCell className="text-emerald-400 px-4 py-2">{trade.strike}</TableCell>
                  <TableCell className="px-4 py-2">{trade.buyingPrice.toFixed(2)}</TableCell>
                  <TableCell className="px-4 py-2">{trade.exitPrice.toFixed(2)}</TableCell>
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
                  <TableCell className="text-right flex items-center justify-end gap-2 px-4 py-2">
                    {/* Edit Button */}
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
                      {/* === EDIT TRADE SHEET CONTENT MODIFICATION === */}
                      <SheetContent className="flex flex-col h-full max-h-screen p-8"> {/* Added h-full and max-h-screen */}
                        <SheetHeader>
                          <SheetTitle>Edit Trade</SheetTitle>
                          <SheetDescription>
                            Modify the details for this trade.
                          </SheetDescription>
                        </SheetHeader>
                        {/* The form itself is a flex container that grows to fill remaining space */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0"> {/* Added flex-1 and min-h-0 */}
                          {/* This div contains the scrollable form fields */}
                          <div className="flex-1 overflow-y-auto grid gap-4 py-4 pr-2"> {/* This is the scrollable area */}
                            <TradeFormFields initialData={editingTrade} />
                          </div>
                          {/* The submit button, which stays fixed at the bottom */}
                          <div className="mt-4">
                            <Button type="submit" disabled={isPending} className="w-full">
                              {isPending ? "Updating..." : "Save Changes"}
                            </Button>
                          </div>
                        </form>
                      </SheetContent>
                      {/* ============================================ */}
                    </Sheet>

                    {/* Delete Button */}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(trade.id)} disabled={isPending}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete Trade</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}