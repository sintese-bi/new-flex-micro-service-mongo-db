import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircleIcon } from "lucide-react";
import { BigNumbersInterfaces } from "../../interfaces/big_numbers";
import DashboardComponentsBigNumber from "./big_number";
import BigNumbersLoading from "../loading/bignumbers";

function gettingSectionTitle(index: 0 | 1 | 2) {
  const sections = {
    0: "Galonagem, Faturamento e Abastecimento",
    1: "Galonagem: Venda, Resultado Bruto e M/LT",
    2: "Venda & Resultado Bruto de Produto + Lucro Bruto Geral",
  };
  return sections[index];
}

export default function DashboardComponentsBigNumbers({ data }: { data: any }) {
  if (!data) return <BigNumbersLoading />;

  return (
    <div className="flex flex-col gap-2 lg:w-full w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-600">Margens</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircleIcon size={16} />
              </TooltipTrigger>
              <TooltipContent className="text-sm" side="right">
                <p>Informações gerais contabilizados!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator />
      {data.map(
        (big_numbers_section: BigNumbersInterfaces[], index: 0 | 1 | 2) => (
          <div key={index} className="flex flex-col gap-1 h-full">
            <p className="text-xs font-bold">{gettingSectionTitle(index)}</p>
            <div className="grid lg:grid-cols-3 md:grid-cols-1 md:grid-cols-2 gap-2">
              {big_numbers_section.map((bignumber, index) => {
                return (
                  <DashboardComponentsBigNumber key={index} data={bignumber} />
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
