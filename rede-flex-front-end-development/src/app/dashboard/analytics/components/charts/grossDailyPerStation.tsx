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
import { useEffect, useState } from "react";
import DesktopChart from "../../../../../components/charts/DesktopChart";
import MobileChart from "../../../../../components/charts/MobileChart";
import { handleDashboardGrossDailyPerStation } from "../../actions";
import ChartLoading from "../loading/chart";

export const createChartDataGrossDailyPerStation = (
  data: any,
  filterVariable: any,
  filterVariableOptions: any
) => {
  return {
    labels: data
      .sort((a: any, b: any) => b.percentage - a.percentage)
      .map((item: any) => item.corporate_name),
    datasets: [
      {
        label: filterVariableOptions[filterVariable],
        data: data
          .sort((a: any, b: any) => b.percentage - a.percentage)
          .map(
            (item: any) =>
              item[
                `${
                  filterVariable == "fuel" ? "gallon" : "product"
                }_history_gross`
              ]
          ),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(5, 176, 192)",
      },
      {
        label: `${filterVariableOptions[filterVariable]} meta`,
        data: data
          .sort((a: any, b: any) => b.percentage - a.percentage)
          .map(
            (item: any) =>
              item[
                `${
                  filterVariable == "fuel" ? "gallon" : "product"
                }_history_gross_defined`
              ]
          ),
        fill: false,
        borderColor: "rgb(60, 153, 153)",
        backgroundColor: "rgb(0, 103, 115)",
      },
    ],
  };
};

export default function GrossDailyPerStation() {
  const [data, setData] = useState<any>(null);
  const [filterVariable, setFilterVariable] = useState<"fuel" | "product">(
    "product"
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
      const response = await handleDashboardGrossDailyPerStation({
        variable_type: filterVariable,
      });
      setData(response);
    };
    fetch();

    const intervalId = setInterval(fetch, 4 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [filterVariable]);

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
                {filterVariableOptions[item as "fuel" | "product"]}
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
                ? "Resultado bruto da galonagem por posto"
                : "Resultado bruto de produto por posto"
            }
            data={{ [filterVariable]: data }}
            labelKey="corporate_name"
            valueKeys={{
              real:
                filterVariable === "fuel"
                  ? "gallon_history_gross"
                  : "product_history_gross",
              meta:
                filterVariable === "fuel"
                  ? "gallon_history_gross_defined"
                  : "product_history_gross_defined",
            }}
            itemsPerPage={6}
            filterVariable={filterVariable}
            filterVariableOptions={filterVariableOptions}
            createChartData={createChartDataGrossDailyPerStation}
          />
        ) : (
          <DesktopChart
            title={
              filterVariableOptions[filterVariable] === "Galonagem"
                ? "Resultado bruto da galonagem por posto"
                : "Resultado bruto de produto por posto"
            }
            data={{ [filterVariable]: data }}
            labelKey="corporate_name"
            valueKeys={{
              real:
                filterVariable === "fuel"
                  ? "gallon_history_gross"
                  : "product_history_gross",
              meta:
                filterVariable === "fuel"
                  ? "gallon_history_gross_defined"
                  : "product_history_gross_defined",
            }}
            filterVariable={filterVariable}
            filterVariableOptions={filterVariableOptions}
            createChartData={createChartDataGrossDailyPerStation}
          />
        )
      ) : (
        <ChartLoading />
      )}
    </div>
  );
}
