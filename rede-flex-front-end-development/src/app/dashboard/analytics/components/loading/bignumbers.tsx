import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircleIcon } from "lucide-react";
export default function BigNumbersLoading() {
  return (
    <div className="flex flex-col gap-2 lg:w-3/5 w-full h-full lg:h-96">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-slate-600">Flex Monitor</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircleIcon size={16} />
            </TooltipTrigger>
            <TooltipContent className="text-sm" side="right">
              <p>Informações gerais contabilizados!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Separator />
      <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 grid-cols-2 h-full justify-center items-center">
        <Skeleton className="flex flex-col gap-4 h-full lg:px-8 md:px-8 sm:px-4 xs:px-4 px-4 rounded-lg  justify-center">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
        <Skeleton className="flex flex-col gap-4 h-full lg:px-8 md:px-8 sm:px-4 xs:px-4 px-4 rounded-lg  justify-center">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
        <Skeleton className="flex flex-col gap-4 h-full lg:px-8 md:px-8 sm:px-4 xs:px-4 px-4 rounded-lg  justify-center">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
        <Skeleton className="flex flex-col gap-4 h-full lg:px-8 md:px-8 sm:px-4 xs:px-4 px-4 rounded-lg  justify-center">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
        <Skeleton className="flex flex-col gap-4 h-full lg:px-8 md:px-8 sm:px-4 xs:px-4 px-4 rounded-lg  justify-center">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
        <Skeleton className="flex flex-col gap-4 h-full lg:px-8 md:px-8 sm:px-4 xs:px-4 px-4 rounded-lg  justify-center">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Skeleton>
      </div>
    </div>
  );
}
