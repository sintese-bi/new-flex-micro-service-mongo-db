import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DailyFuel from "./daily_fuel";
import DailyProduct from "./daily_product";
import Invoicing from "./invoicing";
import RegionFuel from "./region_fuel";
import RegionProduct from "./region_product";
import { AlertCircleIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import GrossDailyPerStation from "./grossDailyPerStation";
export default function DashboardComponentsCharts() {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-600">
              Os gráficos abaixo mostram a evolução diária dos resultados
              brutos, galonagem e faturamento de produtos, como também o
              desdobramento dessas variáveis por posto. Todo gráfico possui
              metas a serem alcançadas. O valor percentual representa o quão
              distante a variável está da meta.
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircleIcon size={16} />
                </TooltipTrigger>
                <TooltipContent className="text-sm" side="right">
                  <p>
                    Os gráficos abaixo mostram a evolução diária dos resultados
                    <br />
                    brutos, galonagem e faturamento de produtos, como também o{" "}
                    <br />
                    desdobramento dessas variáveis por posto. Todo gráfico{" "}
                    <br />
                    possui metas a serem alcançadas. O valor percentual <br />
                    representa o quão distante a variável está da meta.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Separator />
      </div>
      <Invoicing />
      <GrossDailyPerStation />
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="flex items-center justify-center lg:flex-row md:flex-row sm:flex-col xs:flex-col flex-col gap-2 h-full w-full">
          <RegionFuel />
        </div>
        <div className="flex items-center justify-center lg:flex-row md:flex-row sm:flex-col xs:flex-col flex-col gap-2 h-full w-full">
          <DailyFuel />
        </div>
        <div className="flex items-center justify-center lg:flex-row md:flex-row sm:flex-col xs:flex-col flex-col gap-2 h-full w-full">
          <RegionProduct />
        </div>
        <div className="flex items-center justify-center lg:flex-row md:flex-row sm:flex-col xs:flex-col flex-col gap-2 h-full w-full">
          <DailyProduct />
        </div>
      </div>
    </>
  );
}
