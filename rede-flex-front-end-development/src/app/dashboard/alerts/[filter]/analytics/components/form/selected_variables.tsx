"use client";
import { Badge } from "@/components/ui/badge";
import { CircleXIcon } from "lucide-react";
import { VariablesInterfaces } from "../../interfaces/variables";
import { handleAlertsVariablesUnselect } from "../../actions";
export default function SelectedVariablesAlerts({
  alertsVariables,
}: {
  alertsVariables: VariablesInterfaces[];
}) {
  const selectedVariables = alertsVariables.filter(
    ({ value }) => value !== false
  );
  return (
    <div className="w-full">
      <p className="text-xs font-bold w-full text-slate-400 w-full">
        {!selectedVariables.length
          ? "Por favor, escolha uma ou mais variáveis para serem monitoradas."
          : "Variáveis monitoradas"}
      </p>

      <div className="grid gap-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 grid-cols-2 justify-center items-center py-2 w-full">
        {selectedVariables.map(({ label }, index: number) => {
          return (
            <Badge
              key={index}
              variant="default"
              className="flex justify-center items-center bg-main-color py-2 cursor-pointer rounded-md gap-2"
              onClick={() => handleAlertsVariablesUnselect(label)}
            >
              {label}
              <CircleXIcon size={16} />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
