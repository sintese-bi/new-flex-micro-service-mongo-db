import { handleTMsAndBruteProfitPerRegionalUpdate } from "@/app/dashboard/analytics/actions";
import { IRegionalsSectionsFields } from "@/app/dashboard/analytics/components/systemParameterizationModal/content/fields/regional";
import RowForm from "@/app/dashboard/analytics/components/systemParameterizationModal/content/forms_table/form";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type TransposedMobileTableProps = {
  data: any[];
  fields: IRegionalsSectionsFields[];
  filterKey: string;
};

export function TransposedMobileTable({
  data,
  filterKey,
}: TransposedMobileTableProps) {
  const uniqueOptions = [...new Set(data.map((item) => item[filterKey]))];
  const [selected, setSelected] = useState(uniqueOptions[0]);

  const selectedData = data.find((item) => item[filterKey] === selected);

  if (!selectedData) return null;

  const rowValues = { ...selectedData };
  delete rowValues["id"];
  delete rowValues["region_name"];

  return (
    <div className="space-y-6">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione" />
        </SelectTrigger>
        <SelectContent>
          {uniqueOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="bg-white border rounded-md p-4 shadow-sm w-full max-w-[700px] mx-auto">
        <RowForm
          id={selectedData.id}
          rowValues={rowValues}
          updateFunction={handleTMsAndBruteProfitPerRegionalUpdate}
        />
      </div>
    </div>
  );
}
