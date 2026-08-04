"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
import { useEffect, useState } from "react";
import ChartLoading from "../loading/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { handleDashboardGrossDaily } from "../../actions";
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
export default function GrossDaily() {
  const [data, setData] = useState<any>(null);
  const [filterVariable, setFilterVariable] = useState<"fuel" | "product">(
    "fuel"
  );
  const filterVariableOptions = {
    fuel: "Galonagem",
    product: "Produto",
  };
  useEffect(() => {
    if (data) {
      setData(null);
    }
    const fetch = async () => {
      const response = await handleDashboardGrossDaily({
        variable_type: filterVariable,
      });
      setData(response);
    };
    fetch();
    const intervalId = setInterval(fetch, 4 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [filterVariable]);
  if (!data) return <ChartLoading />;
  const chartData = {
    labels: data.map((item: any) => item.data),
    datasets: [
      {
        label: filterVariableOptions[filterVariable],
        data: data.map((item: any) => item.gross_result),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(5, 176, 192)",
        tension: 0.1,
      },
      {
        label: `${filterVariableOptions[filterVariable]} meta`,
        data: data.map((item: any) => item.gross_result_defined),
        fill: false,
        borderColor: "rgb(60, 153, 153)",
        backgroundColor: "rgb(0, 103, 115)",
        tension: 0.1,
      },
    ],
  };
  const options = {
    animation: {
      duration: 1500,
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
        ticks: {
          callback: function (value: any) {
            const variable = filterVariableOptions[filterVariable];
            return variable != "Galonagem" ? `R$ ${value}` : `${value} L`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-2 lg:h-full md:h-full sm:h-96 xs:h-96 h-96 w-full">
      <div className="flex gap-2">
        <Select
          name="variable"
          onValueChange={(value: any) => setFilterVariable(value)}
          defaultValue={filterVariable}
        >
          <SelectTrigger className="w-full text-xs w-[200px] h-8">
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(filterVariableOptions).map((item: string, index) => (
              <SelectItem key={index} value={item}>
                {filterVariableOptions[item as "fuel" | "product"]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="flex flex-col justify-center items-start h-full">
        <p className="text-xs font-bold text-slate-800 uppercase">
          Resultado Bruto Diário{" "}
          {`${
            filterVariableOptions[filterVariable] == "Galonagem"
              ? "da Galonagem"
              : "do Produto"
          }`}
        </p>
        <Bar data={chartData} className="h-full w-full" options={options} />
      </div>
    </div>
  );
}
