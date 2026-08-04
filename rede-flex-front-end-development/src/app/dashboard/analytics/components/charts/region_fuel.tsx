import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import "chart.js/auto";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  handleDashboardRegionalFuelChart,
  handleDashboardRegionalStationChart,
} from "../../actions";
import ChartLoading from "../loading/chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});

// Main wrapper component
export default function RegionFuel() {
  const [filterVar, setFilterVar] = useState<"volume_sold" | "invoicing">(
    "volume_sold"
  );
  const [level, setLevel] = useState<"regional" | "station">("regional");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  return (
    <div className="flex flex-col gap-2 h-96 lg:h-full w-full">
      {/* Controls */}
      <div className="flex gap-2">
        <Select
          name="variable"
          defaultValue={filterVar}
          onValueChange={(v) => setFilterVar(v as any)}
        >
          <SelectTrigger className="w-[200px] h-8 text-xs z-50">
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume_sold">Galonagem</SelectItem>
            <SelectItem value="invoicing">Faturamento</SelectItem>
          </SelectContent>
        </Select>

        {level === "station" && (
          <Button className="h-8 text-xs" onClick={() => setLevel("regional")}>
            Voltar
          </Button>
        )}
      </div>

      <Separator />

      {/* Chart area */}
      <div className="flex flex-col flex-1">
        <p className="text-xs font-bold text-slate-800 uppercase">
          Gráfico regional combustível
        </p>
        {level === "regional" ? (
          <RegionalChart
            key={`regional-${filterVar}`}
            filterVar={filterVar}
            onSelect={(region) => {
              setSelectedRegion(region);
              setLevel("station");
            }}
          />
        ) : (
          <RegionalStationChart
            key={`station-${selectedRegion}-${filterVar}`}
            region={selectedRegion}
            filterVar={filterVar}
          />
        )}
      </div>
    </div>
  );
}

// Regional-level chart
interface RegionalChartProps {
  filterVar: "volume_sold" | "invoicing";
  onSelect: (region: string) => void;
}
function RegionalChart({ filterVar, onSelect }: RegionalChartProps) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const resp = await handleDashboardRegionalFuelChart({
        variable_type: filterVar,
      });
      setData(resp);
    }
    load();
  }, [filterVar]);

  if (!data) return <ChartLoading />;

  const rawLabels = Object.keys(data);
  const labels = rawLabels.map((name) => {
    if (name.startsWith("Regional ")) {
      const core = name.slice(9);
      return /^\d+$/.test(core) ? `Reg. ${core}` : core;
    }
    return name;
  });

  const chartData = {
    labels,
    datasets: [
      {
        axis: "y",
        label: filterVar === "volume_sold" ? "Galonagem" : "Faturamento",
        data: rawLabels.map((key) => data[key]),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(5, 176, 192)",
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "x",
    aspectRatio: 1.2,
    animation: { duration: 1500 },
    onClick: (_e, elements) => {
      if (elements && elements.length > 0) {
        onSelect(rawLabels[elements[0].index]);
      }
    },
  };

  return (
    <div className="relative w-[90vw] h-[40vh] md:w-[50vw] md:h-[40vh] lg:w-[40vw] lg:h-[70vh]">
      <Bar data={chartData} options={options} />
    </div>
  );
}

// Station-level chart
interface RegionalStationChartProps {
  region: string;
  filterVar: "volume_sold" | "invoicing";
}
function RegionalStationChart({
  region,
  filterVar,
}: RegionalStationChartProps) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const resp = await handleDashboardRegionalStationChart({
        regional_type: region.replace(/\s+/g, "").toUpperCase(),
        variable_type: filterVar,
        filter: 1,
      });
      setData(resp);
    }
    load();
  }, [region, filterVar]);

  if (!data) return <ChartLoading />;

  const rawLabels = Object.keys(data);
  const labels = rawLabels.map((name) => {
    const words = name.split(" ");
    return words.length > 2 ? `${words[0]} ${words[1]}...` : name;
  });

  const chartData = {
    labels,
    datasets: [
      {
        axis: "y",
        label: filterVar === "volume_sold" ? "Galonagem" : "Faturamento",
        data: rawLabels.map((key) => data[key]),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(5, 176, 192)",
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "x",
    aspectRatio: 1.2,
    animation: { duration: 1500 },
  };

  return (
    <div className="relative w-[90vw] h-[40vh] md:w-[50vw] md:h-[40vh] lg:w-[40vw] lg:h-[70vh]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
