import Chart from "chart.js/auto";
import dynamic from "next/dynamic";

interface DesktopChartProps {
  title: string;
  data: Record<string, any[]>;
  labelKey: string;
  valueKeys: {
    real: string;
    meta: string;
  };
  filterVariable: string;
  filterVariableOptions: Record<string, string>;
  createChartData: (
    data: any,
    filterVariable: any,
    filterVariableOptions: any
  ) => any;
  onClickBar?: (label: string) => void;
  handleCombScroll?: any;
  handleProdScroll?: any;
}

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

export default function DesktopChart({
  title,
  data,
  labelKey,
  valueKeys,
  filterVariable,
  filterVariableOptions,
  createChartData,
  onClickBar,
  handleCombScroll,
  handleProdScroll,
}: DesktopChartProps) {
  const sorted = data[filterVariable].sort(
    (a: any, b: any) =>
      b[valueKeys.real] / b[valueKeys.meta] -
      a[valueKeys.real] / a[valueKeys.meta]
  );

  const chartData = createChartData(
    data[filterVariable],
    filterVariable,
    filterVariableOptions
  );
  const options = {
    animation: {
      duration: 1500,
    },
    onClick: async (event: any, activeElements: any) => {
      if (activeElements.length > 0) {
        filterVariableOptions[filterVariable] == "Galonagem"
          ? handleCombScroll()
          : handleProdScroll();
      }
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
            return variable != "Galonagem" ? `R$ ${value}` : `${value} L`; // Add the "(L)" symbol to each tick
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

      // Loop through each data point to calculate and draw the custom value
      dataset1.forEach((value1: any, index: any) => {
        const value2: any = dataset2[index];
        const xPos = x.getPixelForValue(index); // X position of the bar
        const yPos1 = y.getPixelForValue(value1); // Y position of the first dataset
        const yPos2 = y.getPixelForValue(value2); // Y position of the second dataset

        const divisionResult = ((value1 / value2) * 100).toFixed(); // Calculate division and multiply by 100

        ctx.save();
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";

        // Render the calculated value above the higher of the two bars
        const labelYPos = Math.min(yPos1, yPos2) - 10;
        ctx.fillText(`${divisionResult}%`, xPos, labelYPos);
        ctx.restore();
      });
    },
  };

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <p className="text-xs font-bold text-slate-800 uppercase mb-2">{title}</p>
      <div className="w-full flex">
        <Bar
          data={chartData}
          className="h-full w-full"
          plugins={[customPlugin]}
          options={options}
        />
      </div>
    </div>
  );
}
