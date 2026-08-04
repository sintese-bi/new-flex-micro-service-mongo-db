import Chart, { ChartData } from "chart.js/auto";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export interface LocalChartData
  extends ChartData<"bar", (number | [number, number] | null)[]> {
  labels: string[];
  datasets: {
    label: string;
    data: (number | [number, number] | null)[];
    backgroundColor: string;
    borderColor: string;
    fill?: boolean;
  }[];
}

interface MobileChartProps {
  title: string;
  data: Record<string, any[]>;
  labelKey: string;
  valueKeys: {
    real: string;
    meta: string;
  };
  itemsPerPage: number;
  filterVariable: string;
  filterVariableOptions: Record<string, string>;
  createChartData: (
    data: any,
    filterVariable: any,
    filterVariableOptions: any
  ) => any;
}

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

export default function MobileChart({
  title,
  data,
  labelKey,
  valueKeys,
  itemsPerPage,
  filterVariable,
  filterVariableOptions,
  createChartData,
}: MobileChartProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string>("");

  useEffect(() => {
    setCurrentPage(0);
    setSelectedLabel("");
  }, [filterVariable]);

  const dataArray = data[filterVariable];
  const sorted = dataArray.sort(
    (a: any, b: any) =>
      b[valueKeys.real] / b[valueKeys.meta] -
      a[valueKeys.real] / a[valueKeys.meta]
  );

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const pagedData = sorted.slice(startIndex, startIndex + itemsPerPage);
  const chartData = createChartData(
    pagedData,
    filterVariable,
    filterVariableOptions
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500 },
    plugins: { tooltip: { enabled: false } },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedLabel(pagedData[index]?.[labelKey] || "");
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          font: { size: 10 },
          callback: function (val: any, index: number) {
            const name = pagedData[index]?.[labelKey] || "";
            return name.length > 10 ? name.slice(0, 10) + "…" : name;
          },
        },
      },
      y: {
        ticks: {
          font: { size: 10 },
          callback: function (value: any) {
            const variable = filterVariableOptions[filterVariable];
            return variable !== "Galonagem" ? `R$ ${value}` : `${value} L`;
          },
        },
      },
    },
  };

  const customPlugin = {
    id: "customPlugin",
    afterDatasetsDraw(chart: Chart) {
      const {
        ctx,
        data,
        chartArea: { top, left, right, bottom, width, height },
        scales: { x, y },
      } = chart;

      const dataset1 = data.datasets[0].data;
      const dataset2 = data.datasets[1].data;

      dataset1.forEach((value1: any, index: any) => {
        const value2: any = dataset2[index];
        const xPos = x.getPixelForValue(index);
        const yPos1 = y.getPixelForValue(value1);
        const yPos2 = y.getPixelForValue(value2);
        const divisionResult = ((value1 / value2) * 100).toFixed();

        ctx.save();
        ctx.font = "10px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        const labelYPos = Math.min(yPos1, yPos2) - 10;
        ctx.fillText(`${divisionResult}%`, xPos, labelYPos);
        ctx.restore();
      });
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-2">
      <p className="text-xs font-bold text-slate-800 uppercase mb-2 text-center">
        {title}
      </p>
      <div className="w-full flex justify-center ">
        <div className="w-full max-w-4xl h-[400px] sm:h-[350px] xs:h-[300px]">
          <Bar
            data={chartData}
            options={options}
            plugins={[customPlugin]}
            className="!w-full !h-full"
          />
        </div>
      </div>
      {selectedLabel && (
        <div className="mt-4 text-center bg-slate-100 text-slate-800 text-sm px-3 py-2 rounded-md shadow-sm max-w-md">
          <span className="font-semibold">Nome completo:</span>{" "}
          <span className="italic">{selectedLabel}</span>
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="text-xs px-2 py-1 border rounded disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-xs">
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
            className="text-xs px-2 py-1 border rounded disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
