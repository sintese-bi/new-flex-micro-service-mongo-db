"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Autoplay from "embla-carousel-autoplay";
import { AlertCircleIcon } from "lucide-react";
import {
  fuelLabelMap,
  FuelResults,
  ResultsRedeWithLabels,
} from "../../interfaces/result_redes";

type CarrousselProps = {
  data: FuelResults;
};

export function transformResults(results: FuelResults): ResultsRedeWithLabels {
  const labeled: Partial<ResultsRedeWithLabels> = {};

  for (const key in results) {
    const label = fuelLabelMap[key as keyof FuelResults];
    if (label) {
      // @ts-ignore
      labeled[label] = results[key as keyof FuelResults];
    }
  }

  return labeled as ResultsRedeWithLabels;
}
export default function Carroussel({ data }: CarrousselProps) {
  const transformedData = transformResults(data);

  return (
    <div className="flex flex-col gap-2 lg:w-full w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-600">
            Margens de combustíveis
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircleIcon size={16} />
              </TooltipTrigger>
              <TooltipContent className="text-sm" side="right">
                <p>Informações das margens!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Separator />
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="relative"
      >
        <CarouselContent className="space-x-2 px-4">
          {Object.keys(transformedData).map((key) => (
            <CarouselItem
              key={key}
              className="basis-1/3 flex flex-col justify-center w-[160px] min-h-[120px] bg-main-color p-4 rounded-md md:h-full"
            >
              <p className="text-sm text-slate-400 font-bold">{key}</p>
              <p className="text-sm text-white">
                R$ {transformedData[key as keyof ResultsRedeWithLabels]}
              </p>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
}
