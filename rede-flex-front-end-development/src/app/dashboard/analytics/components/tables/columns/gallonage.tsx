"use client";
import { Button } from "@/components/ui/button";
import RankingTable from "../children_tables/ranking_table";
import { ArrowUpDownIcon } from "lucide-react";

export const gallonage: any[] = [
  {
    accessorKey: "name",
    header: "Posto",
    cell: ({ row }: any) => <RankingTable row={row} type="galonagem" />,
  },
  {
    accessorKey: "Última Atualizacao",
    header: "Hora da última venda",
  },
  {
    accessorKey: "Lucro Bruto Operacional Galonagem",
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
      const amount = parseFloat(
        row.getValue("Lucro Bruto Operacional Galonagem")
      );
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(amount));

      return <div className="font-medium">{formatted} %</div>;
    },
  },
  {
    accessorKey: "Resultado Bruto",
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
      const amount = parseFloat(row.getValue("Resultado Bruto"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium text-center">R$ {formatted}</div>;
    },
  },
  {
    accessorKey: "TMC",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TMC
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("TMC"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium">R$ {formatted}</div>;
    },
  },
  {
    accessorKey: "TMV",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TMV
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("TMV"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium">{formatted} L</div>;
    },
  },
  {
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

  /**
   * {
    accessorKey: "Lucro com Desconto",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lucro com Desconto
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("Lucro com Desconto"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return <div className="font-medium">R$ {formatted}</div>;
    },
  },

   */

  /**
  *  {
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
      }).format(Math.round(amount));
      return <div className="font-medium">{formatted} (L)</div>;
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
  {
    accessorKey: "Lucro",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lucro
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
  {
    accessorKey: "Abastecimentos",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Abastecimentos
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
  },

   */
  {
    accessorKey: "Posto_ibm",
    header: "Posto ibm",
  },
];
