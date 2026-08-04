import { DataTable } from "./table";
import { handleAlertsTable } from "../../actions";
import { columns } from "./columns";
export default async function AlertsTables({ filter }: { filter: string }) {
  const table = await handleAlertsTable(filter);
  return (
    <div className="flex flex-col gap-12 pb-6 w-full">
      <DataTable columns={columns} data={table} />
    </div>
  );
}
