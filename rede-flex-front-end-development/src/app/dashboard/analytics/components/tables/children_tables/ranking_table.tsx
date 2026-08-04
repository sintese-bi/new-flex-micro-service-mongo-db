import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DataTable } from "../table";
import { useEffect, useState } from "react";
import {
  handleGallonageRankingByStation,
  handleProductRankingByStation,
} from "../../../actions";
import { ranking_gallonage } from "../columns/ranking_gallonage";
import { ranking_product } from "../columns/ranking_product";

export default function RankingTable({
  row,
  type,
}: {
  row: any;
  type: string;
}) {
  const name = row.getValue("name");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response =
        type !== "produto"
          ? await handleGallonageRankingByStation(row.original.Posto_ibm)
          : await handleProductRankingByStation(row.original.Posto_ibm);
      setData(response);
    };
    fetch();
  }, [row.original.Posto_ibm, type]);
  return (
    <Sheet>
      <SheetTrigger>{name}</SheetTrigger>
      <SheetContent className="xl:w-[1000px] xl:max-w-none sm:w-[400px] sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <DataTable
          columns={type !== "produto" ? ranking_gallonage : ranking_product}
          data={data}
          title={`Ranking de frentistas ${type} - ${name}`}
          messageTitle=""
        />
      </SheetContent>
    </Sheet>
  );
}
