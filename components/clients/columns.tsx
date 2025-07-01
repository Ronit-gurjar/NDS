// components/clients/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

// Define the type for your user data, matching your Prisma model
export interface User {
  id: string;
  fullName: string;
  mobileNumber: string;
  isVerified: boolean;
  createdAt: string; // ISO string
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id", // Not directly displayed, but useful if you need to access it
    header: "S.NO",
    cell: ({ row }) => {
      // This calculates the S.NO based on the row's index.
      // If you implement pagination later, you might need to adjust this
      // to include the page index * page size.
      return row.index + 1;
    },
    enableSorting: false, // Don't sort by S.NO
    enableHiding: false, // Always show S.NO
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "mobileNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mobile Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("mobileNumber")}</div>,
  },
  {
    accessorKey: "isVerified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Verified
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified");
      return (
        <div className="text-center">
          {isVerified ? (
            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mx-auto" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Join Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-right">{date.toLocaleDateString()}</div>;
    },
  },
]