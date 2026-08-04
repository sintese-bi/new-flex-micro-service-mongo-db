import { Skeleton } from "@/components/ui/skeleton";
export default async function MapLoading() {
  return (
    <div className="flex justify-center flex-col space-y-3 w-2/5 h-full lg:h-96">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
