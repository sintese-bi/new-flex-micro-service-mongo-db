"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
export const workers_gallonage: any[] = [
  {
    accessorKey: "User_id",
    header: "User_id",
  },
  {
    accessorKey: "ibm",
    header: "ibm",
  },
  {
    accessorKey: "name",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
  },
  {
    accessorKey: "Regional",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Regional
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
  },
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
    accessorKey: "Combustivel Vendido",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Combustivel Vendido
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
  },
  {
    accessorKey: "Galonagem",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Galonagem
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("Galonagem"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium">{formatted} (L)</div>;
    },
  },
  /**
   * {
    accessorKey: "M/LT",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          M/LT
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("M/LT"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium">R$ {formatted}</div>;
    },
  },
  {
    accessorKey: "LBO Combustivel",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          LBO Combustivel
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("LBO Combustivel"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(amount));

      return <div className="font-medium">{formatted} %</div>;
    },
  },
   */
  /**
   * {
    accessorKey: "Rendimento Bruto",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rendimento Bruto
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("Rendimento Bruto"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(amount));

      return <div className="font-medium">{formatted} %</div>;
    },
  },
   */
  /**
   * {
    accessorKey: "Venda",
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
      const amount = parseFloat(row.getValue("Venda"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium">R$ {formatted}</div>;
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

      return <div className="font-medium">R$ {formatted}</div>;
    },
  },
   */
  {
    accessorKey: "Lucro",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Margem bruta
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

      return <div className="font-medium">R$ {formatted}</div>;
    },
  },
];
