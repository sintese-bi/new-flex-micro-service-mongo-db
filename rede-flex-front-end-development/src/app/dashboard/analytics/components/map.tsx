import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircleIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
const Leaflet = dynamic(() => import("@/components/map/leaflet-map"), {
  ssr: false,
});
export default function DashboardComponentsMap({ data }: { data: any }) {
  const mapRef = useRef<L.Map | null>(null);
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [mapRef.current]);
  return (
    <div className="flex flex-col gap-2 w-full rounded-lg h-full min-h-[560px]">
      <div className="flex items-center gap-2">
        <p className="flex items-center text-sm font-bold text-slate-600">
          Geolocalização de postos
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircleIcon size={16} />
            </TooltipTrigger>
            <TooltipContent className="text-sm h-8" side="right">
              <p>Mapa com distribuição dos postos!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator />
      <div className="w-full h-full rounded-lg h-[80vh] md:h-full">
        <div className=" bg-slate-200 h-full w-full rounded-lg">
          <Leaflet data={data} />
        </div>
      </div>
    </div>
  );
}
