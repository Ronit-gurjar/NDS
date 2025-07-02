// components/trade-form-fields.tsx
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import both Trade and DailyBestTrade types, as they share the same structure now
import { type Trade as PrismaTrade, type DailyBestTrade as PrismaDailyBestTrade } from '@prisma/client';

interface TradeFormFieldsProps {
  initialData?: PrismaTrade | PrismaDailyBestTrade | null;
  // `formIdPrefix` helps ensure unique IDs for inputs when used in different contexts
  formIdPrefix: string; 
}

export const TradeFormFields = ({ initialData, formIdPrefix }: TradeFormFieldsProps) => (
  <>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-sno`}>S.NO</Label>
      <Input id={`${formIdPrefix}-sno`} name="sno" type="number" required defaultValue={initialData?.sno || ''} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-date`}>Date</Label>
      <Input id={`${formIdPrefix}-date`} name="date" type="text" placeholder="e.g., 12-05-2025" required defaultValue={initialData?.date || ''} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-strike`}>Strike</Label>
      <Input id={`${formIdPrefix}-strike`} name="strike" type="text" required defaultValue={initialData?.strike || ''} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-buyingPrice`}>Buying Price</Label>
      <Input id={`${formIdPrefix}-buyingPrice`} name="buyingPrice" type="number" step="0.01" required defaultValue={initialData?.buyingPrice || ''} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-exitPrice`}>Exit Price</Label>
      <Input id={`${formIdPrefix}-exitPrice`} name="exitPrice" type="number" step="0.01" required defaultValue={initialData?.exitPrice || ''} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-target`}>Target</Label>
      <Input id={`${formIdPrefix}-target`} name="target" type="text" defaultValue={initialData?.target || ''} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-high`}>High</Label>
      <Input id={`${formIdPrefix}-high`} name="high" type="text" defaultValue={initialData?.high || ''} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-profitLoss`}>Profit/Loss</Label>
      <Input id={`${formIdPrefix}-profitLoss`} name="profitLoss" type="text" placeholder="PROFIT / LOSS" defaultValue={initialData?.profitLoss || ''} />
    </div>
    <div className="grid gap-2">
      <Label htmlFor={`${formIdPrefix}-totalPoints`}>Total Points</Label>
      <Input id={`${formIdPrefix}-totalPoints`} name="totalPoints" type="number" step="0.01" defaultValue={initialData?.totalPoints || ''} />
    </div>
  </>
);