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
import {
  handleDashboardRegionalFuelChart,
  handleDashboardRegionalStationChart,
} from "../../actions";
import { Button } from "@/components/ui/button";
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
export default function SecondGraph() {
  const [data, setData] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState<"regional" | "station">(
    "regional"
  );
  const [clickedLabel, setClickedLabel] = useState<string>("");
  const [filterVariable, setFilterVariable] = useState<
    "volume_sold" | "invoicing"
  >("volume_sold");
  const filterVariableOptions = [
    { variable: "volume_sold", label: "Galonagem" },
    { variable: "invoicing", label: "Faturamento" },
  ];

  useEffect(() => {
    if (data) {
      setData(null);
    }
    const fetch = async () => {
      const response =
        currentLevel == "regional"
          ? await handleDashboardRegionalFuelChart({
              variable_type: filterVariable,
            })
          : await handleDashboardRegionalStationChart({
              regional_type: clickedLabel.replace(" ", "").toUpperCase(),
              variable_type: filterVariable,
              filter: 1,
            });
      setData(response);
    };
    fetch();
    const intervalId = setInterval(fetch, 4 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [filterVariable, clickedLabel, currentLevel]);
  if (!data) return <ChartLoading />;
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: filterVariableOptions.filter(
          (item) => item["variable"] == filterVariable
        )[0]["label"],
        data: Object.values(data),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(5, 176, 192)",
        tension: 0.1,
      },
    ],
  };
  const options = {
    animation: {
      duration: 1500,
    },
    onClick: async (event: any, activeElements: any) => {
      if (activeElements.length > 0 && currentLevel !== "station") {
        const clickedElementIndex = activeElements[0].index;
        setClickedLabel(chartData.labels[clickedElementIndex]);
        setCurrentLevel("station");
      }
    },
    scales: {
      x: {
        display: currentLevel !== "station" ? true : false, // Desativa a exibição do eixo X
      },
    },
  };

  async function handlePreviousLevel() {
    setData(null);
    let response = await handleDashboardRegionalFuelChart({
      variable_type: filterVariable,
    });
    setCurrentLevel("regional");
    setData(response);
  }
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
            {filterVariableOptions.map(
              (filter: { variable: string; label: string }, index: number) => (
                <SelectItem key={index} value={filter["variable"]}>
                  {filter["label"]}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Button
          className="text-xs h-8"
          disabled={currentLevel == "regional"}
          onClick={handlePreviousLevel}
        >
          Voltar
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col justify-center items-start h-full">
        <p className="text-xs font-bold text-slate-800 uppercase">
          Gráfico regional combustível
        </p>
        <Bar data={chartData} className="h-full w-full" options={options} />
      </div>
    </div>
  );
}
