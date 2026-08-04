"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import "chart.js/auto";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  handleDashboardDailyFuelChart,
  handleDashboardDailyStationChart,
} from "../../actions";
import ChartLoading from "../loading/chart";
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
export default function DailyFuel() {
  const [data, setData] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState<"daily" | "station">(
    "daily"
  );
  const [clickedLabel, setClickedLabel] = useState<string>("");
  const [filterVariable, setFilterVariable] = useState<
    "volume_sold" | "invoicing"
  >("volume_sold");
  const [filterDay, setFilterDay] = useState<
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | string
  >(format(new Date(), "EEEE"));

  const filterVariableOptions = [
    { variable: "volume_sold", label: "Galonagem" },
    { variable: "invoicing", label: "Faturamento" },
  ];
  const filterDayOptions = [
    { variable: "Sunday", label: "Domingo" },
    { variable: "Monday", label: "Segunda" },
    { variable: "Tuesday", label: "Terça" },
    { variable: "Wednesday", label: "Quarta" },
    { variable: "Thursday", label: "Quinta" },
    { variable: "Friday", label: "Sexta" },
    { variable: "Saturday", label: "Sábado" },
  ];
  useEffect(() => {
    if (data) {
      setData(null);
    }
    const fetch = async () => {
      const response =
        currentLevel == "daily"
          ? await handleDashboardDailyFuelChart({
              week_day: filterDay,
              variable_type: filterVariable,
            })
          : await handleDashboardDailyStationChart({
              week_day: clickedLabel,
              variable_type: filterVariable,
              filter: 1,
            });
      setData(response);
    };
    fetch();
    const intervalId = setInterval(fetch, 4 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [filterVariable, filterDay, clickedLabel, currentLevel]);
  if (!data) return <ChartLoading />;
  const chartData = {
    labels:
      currentLevel == "daily" && Array.isArray(data)
        ? data.map((data_item: any) => data_item["date"])
        : Object.keys(data),
    datasets: [
      {
        label:
          filterVariableOptions.find((item) => item.variable === filterVariable)
            ?.label || "",
        data:
          currentLevel == "daily" && Array.isArray(data)
            ? data.map((data_item: any) => data_item["sum"])
            : Object.values(data),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(5, 176, 192)",
        tension: 0.1,
      },
    ],
  };
  const options = {
    aspectRatio: 1.2,
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
    setCurrentLevel("daily");
  }
  return (
    <div className="flex flex-col gap-2 lg:h-full md:h-full sm:h-96 xs:h-96 h-96 w-full">
      <div className="flex w-full h-ful gap-2">
        <div className="flex gap-2">
          <Select
            name="variable"
            onValueChange={(value: any) => setFilterDay(value)}
            defaultValue={filterDay}
          >
            <SelectTrigger className="w-full text-xs sm:w-[120px] md:w-[200px] h-8 z-50">
              <SelectValue placeholder="Dia da semana" />
            </SelectTrigger>
            <SelectContent side="bottom">
              {filterDayOptions.map(
                (
                  filter: { variable: string; label: string },
                  index: number
                ) => (
                  <SelectItem key={index} value={filter["variable"]}>
                    {filter["label"]}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Select
            name="variable"
            onValueChange={(value: any) => setFilterVariable(value)}
            defaultValue={filterVariable}
          >
            <SelectTrigger className="w-full text-xs sm:w-[120px] md:w-[200px] h-8">
              <SelectValue placeholder="Variável" />
            </SelectTrigger>
            <SelectContent>
              {filterVariableOptions.map(
                (
                  filter: { variable: string; label: string },
                  index: number
                ) => (
                  <SelectItem key={index} value={filter["variable"]}>
                    {filter["label"]}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Button
            className="text-xs h-8"
            disabled={currentLevel == "daily"}
            onClick={handlePreviousLevel}
          >
            Voltar
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col justify-center items-start h-full">
        <p className="text-xs font-bold text-slate-800 uppercase">
          Gráfico diário combustível
        </p>
        <div className="relative w-[90vw] h-[40vh] md:w-[50vw] md:h-[40vh] lg:w-[40vw] lg:h-[70vh]">
          <Bar data={chartData} className="h-full w-full" options={options} />
        </div>
      </div>
    </div>
  );
}
