"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
export const fuel: any[] = [
  {
    accessorKey: "name",
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
    accessorKey: "Combustivel",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Combustível
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
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
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(amount);
      return <div className="font-medium">R$ {formatted}</div>;
    },
  },
  {
    accessorKey: "LBO Combsutivel",
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
      const amount = parseFloat(row.getValue("LBO Combsutivel"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Math.round(amount));

      return <div className="font-medium">{formatted} %</div>;
    },
  },
  {
    accessorKey: "Rendimento Bruto",
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
      const amount = parseFloat(row.getValue("Rendimento Bruto"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Math.round(amount));

      return <div className="font-medium">R$ {formatted}</div>;
    },
  },
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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      return <div className="font-medium">R$ {formatted}</div>;
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
          Faturamento
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
  accessorKey: "Hora da Venda",
  header: ({ column }: any) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Hora da Venda
        <ArrowUpDownIcon className="ml-2 h-4 " />
      </Button>
    );
  },
  cell: ({ row }: any) => {
    const horaDaVenda = row.getValue("Hora da Venda");
    
    const formattedHora = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(horaDaVenda));

    return <div className="font-medium">{formattedHora}</div>;
  },
}

  /**
   * {
    accessorKey: "Lucro Com Desconto",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lucro bruto
          <ArrowUpDownIcon className="ml-2 h-4 " />
        </Button>
      );
    },
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("Lucro Com Desconto"));
      const formatted = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return <div className="font-medium">R$ {formatted}</div>;
    },
  },
   */
];
