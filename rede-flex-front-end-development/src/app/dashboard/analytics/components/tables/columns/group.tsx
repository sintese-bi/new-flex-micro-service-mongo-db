"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";

export const group: any[] = [
  {
    accessorKey: "Posto",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posto
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grupo
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
  },
  {
    accessorKey: "Produto",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produto
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
  },

  {
    accessorKey: "TMP",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TMP
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("TMP"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium text-center">R$ {formatted}</div>;
    },
  },
  {
    accessorKey: "LBO Produto",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          LB
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("LBO Produto"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(amount));
      return <div className="font-medium text-center">{formatted} %</div>;
    },
  },
  {
    accessorKey: "Faturamento",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Faturamento
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("Faturamento"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium text-center">R$ {formatted}</div>;
    },
  },
  {
    accessorKey: "Custo",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Custo
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("Custo"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium text-center">R$ {formatted}</div>;
    },
  },
  {
    accessorKey: "Lucro",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RB
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("Lucro"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium text-center">R$ {formatted}</div>;
    },
  },
];
