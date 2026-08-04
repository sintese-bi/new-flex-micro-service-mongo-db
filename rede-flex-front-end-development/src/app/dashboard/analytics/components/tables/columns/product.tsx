"use client";
import { Button } from "@/components/ui/button";
import RankingTable from "../children_tables/ranking_table";
import { ArrowUpDownIcon } from "lucide-react";

export const product: any[] = [
  {
    accessorKey: "name",
    header: "Posto",
    cell: ({ row }: any) => <RankingTable row={row} type="produto" />,
  },
  {
    accessorKey: "Última Atualizacao",
    header: "Hora da última venda",
  },
  {
    accessorKey: "Lucro Operacional Produto",
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
      const amount = parseFloat(row.getValue("Lucro Operacional Produto"));
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
  /**
   * {
    accessorKey: "Valor Vendido",
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
      const amount = parseFloat(row.getValue("Valor Vendido"));
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

      return <div className="font-medium text-center">R$ {formatted}</div>;
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

      return <div className="font-medium text-center">{formatted} %</div>;
    },
  },
   */

  /**
   * {
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
    accessorKey: "QtdProdutosVendidos",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantidade vendida
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const name = row.getValue("QtdProdutosVendidos");
      return <div className="font-medium text-center">{name}</div>;
    },
  },
  {
    accessorKey: "Abastecimentos(Produto)",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Abastecimentos
          <ArrowUpDownIcon className="ml-2 h-4" />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const name = row.getValue("Abastecimentos(Produto)");
      return <div className="font-medium text-center">{name}</div>;
    },
  },
   */

  {
    accessorKey: "Posto_ibm",
    header: "Posto ibm",
  },
];
