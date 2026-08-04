"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import "chart.js/auto";
import { useContext, useEffect, useState } from "react";
import DesktopChart from "../../../../../components/charts/DesktopChart";
import MobileChart from "../../../../../components/charts/MobileChart";
import { handleDashboardInvoicingChart } from "../../actions";
import { DashboardContext } from "../../context";
import ChartLoading from "../loading/chart";

export const createChatDataLinearInvoicing = (
  data: any,
  filterVariable: any,
  filterVariableOptions: any
) => {
  return {
    labels: data.map((item: any) =>
      item?.name?.length > 10 ? item.name.slice(0, 10) + "…" : item.name
    ),
    datasets: [
      {
        label: filterVariableOptions[filterVariable],
        data: data.map((item: any) => item.value),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(5, 176, 192)",
      },
      {
        label: `${filterVariableOptions[filterVariable]} meta`,
        data: data.map((item: any) => item.media),
        borderColor: "rgb(60, 153, 153)",
        backgroundColor: "rgb(0, 103, 115)",
      },
    ],
  };
};

export default function LinearInvoicing() {
  const { handleCombScroll, handleProdScroll } = useContext(DashboardContext);
  const [data, setData] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState<"regional" | "station">(
    "regional"
  );
  const [clickedLabel, setClickedLabel] = useState<string>("");
  const [filterVariable, setFilterVariable] = useState<
    "fatCombustivel" | "fatProduto"
  >("fatProduto");

  const filterVariableOptions = {
    fatCombustivel: "Galonagem",
    fatProduto: "Produto",
  };

  useEffect(() => {
    if (data) setData(null);
    const fetch = async () => {
      const response = await handleDashboardInvoicingChart({
        variable_type: filterVariable,
      });

      setData(response);
    };
    fetch();
    const intervalId = setInterval(fetch, 4 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [filterVariable, clickedLabel, currentLevel]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!data) return <ChartLoading />;

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      <div className="flex gap-2">
        <Select
          name="variable"
          onValueChange={(value: any) => setFilterVariable(value)}
          defaultValue={filterVariable}
        >
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(filterVariableOptions).map((item: string, index) => (
              <SelectItem key={index} value={item}>
                {filterVariableOptions[item as "fatCombustivel" | "fatProduto"]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />

      {data ? (
        isMobile ? (
          <MobileChart
            title={
              filterVariableOptions[filterVariable] === "Galonagem"
                ? "Galonagem mensal por posto"
                : "Produto mensal por posto"
            }
            data={data}
            labelKey="name"
            valueKeys={{ real: "value", meta: "media" }}
            itemsPerPage={6}
            filterVariable={filterVariable}
            filterVariableOptions={filterVariableOptions}
            createChartData={createChatDataLinearInvoicing}
          />
        ) : (
          <DesktopChart
            title={
              filterVariableOptions[filterVariable] === "Galonagem"
                ? "Galonagem mensal por posto"
                : "Produto mensal por posto"
            }
            data={data}
            createChartData={createChatDataLinearInvoicing}
            filterVariable={filterVariable}
            filterVariableOptions={filterVariableOptions}
            handleCombScroll={handleCombScroll}
            handleProdScroll={handleProdScroll}
            labelKey="name"
            valueKeys={{ real: "value", meta: "media" }}
          />
        )
      ) : (
        <ChartLoading />
      )}
    </div>
  );
}
