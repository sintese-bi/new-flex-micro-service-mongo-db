"use client";
import { ColumnDef } from "@tanstack/react-table";
import FormComponentsAlertsTable from "./form";
import SelectedMargins from "./selectedMargins";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
export type Alerts = {
  name: string;
  gas_station_id: string;
  alerts_configuration: string;
  gas_station_whats_app: string;
  variables: { [key: string]: number };
};
export const columns: ColumnDef<Alerts>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "gas_station_id",
    header: "ID",
  },
  {
    accessorKey: "Margens selecionadas",
    header: ({ column }) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-center">
            Margens selecionadas
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top">
            <DropdownMenuItem
              onClick={() => column.toggleVisibility()}
              className="space-x-2"
            >
              <EyeIcon size={18} />
              <p>Ocultar</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    cell: ({ row }) => {
      return <SelectedMargins variables={row.original.variables} />;
    },
  },
  {
    accessorKey: "alerts_configuration",
    header: () => <div className="text-center">Configurar alertas</div>,
    cell: ({ row }) => {
      return (
        <FormComponentsAlertsTable
          ibm_id={row.original.gas_station_id}
          gas_station_whats_app={row.original.gas_station_whats_app}
          variables={row.original.variables}
        />
      );
    },
  },
  {
    accessorKey: "gas_station_whats_app",
    header: "gas_station_whats_app",
  },
];
