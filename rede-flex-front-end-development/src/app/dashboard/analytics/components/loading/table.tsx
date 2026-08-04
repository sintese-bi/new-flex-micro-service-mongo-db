import { Skeleton } from "@/components/ui/skeleton";
export default function TableLoading() {
  return (
    <div className="flex justify-center flex-col space-y-3 w-full h-96">
      <Skeleton className="h-[72px] w-full rounded-xl" />
      <Skeleton className="h-[72px] w-full rounded-xl" />
    </div>
  );
}
