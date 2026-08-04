import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DataTable } from "../table";
import { gallonage } from "../columns/gallonage";
import { product } from "../columns/product";

export default function StationsTable({
  row,
  type,
}: {
  row: any;
  type: string;
}) {
  const name = row.getValue("name");
  return (
    <Sheet>
      <SheetTrigger>{name}</SheetTrigger>
      <SheetContent className="xl:w-[1000px] xl:max-w-none sm:w-[400px] sm:max-w-[540px] overflow-y-auto">
        <DataTable
          data={row.original.stations}
          columns={type !== "produto" ? gallonage : product}
          title={`Acompanhamento ${type} - ${name}`}
          messageTitle=""
        />
      </SheetContent>
    </Sheet>
  );
}
