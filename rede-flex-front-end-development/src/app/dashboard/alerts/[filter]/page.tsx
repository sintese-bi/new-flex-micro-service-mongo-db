import { Suspense } from "react";
import AlertsTables from "./analytics/components/tables";
import LogsComponents from "./analytics/components/logs";
import TableLoading from "../../analytics/components/loading/table";
import Filter from "./analytics/components/filter";

export default async function Alerts({
  params,
}: {
  params: { filter: string };
}) {
  return (
    <div className="flex flex-col w-full h-full justify-start items-start">
      <Filter filter={params.filter} />
      <div className="flex flex-col w-full lg:gap-4 gap-12">
        {/**
         * <Suspense fallback={<TableLoading />}>
          <AlertsTables filter={params.filter} />
        </Suspense>
        <LogsComponents />
         */}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ filter: "station" }, { filter: "region" }];
}
