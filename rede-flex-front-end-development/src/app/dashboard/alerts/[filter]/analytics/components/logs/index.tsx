import { Separator } from "@/components/ui/separator";
import { handleAlertsLogs } from "../../actions";
import { Badge } from "@/components/ui/badge";
export default async function LogsComponents() {
  const { sanados, naosanados } = await handleAlertsLogs();
  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex justify-between w-full">
        <p className="text-xs font-bold uppercase">Log de alertas</p>
        <p className="text-xs font-bold uppercase">
          Quantidade de sanados: {sanados.length}
        </p>
      </div>
      <Separator />
      <div className="grid gap-2 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid-rows-6  w-full">
        {naosanados.map(
          ({ date, variable_name, condition }: any, index: number) => (
            <div
              key={index}
              className="flex flex-col w-full bg-slate-200 rounded-md py-4 px-4 gap-4"
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold">{date}</p>
                <p className="text-xs font-bold">{variable_name}</p>
              </div>
              <div className="flex justify-end">
                <Badge
                  variant="outline"
                  className={`${
                    condition === "sanado" ? "bg-green-500" : "bg-red-500"
                  }  text-white rounded-md`}
                >
                  {condition === "sanado" ? "sanado" : "não sanado"}
                </Badge>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
