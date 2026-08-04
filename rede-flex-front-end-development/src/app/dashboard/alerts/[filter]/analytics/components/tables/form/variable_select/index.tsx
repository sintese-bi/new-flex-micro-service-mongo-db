import { Dispatch, SetStateAction } from "react";
import VariablesMenuDropdown from "./variables_menu_dropdown";
export default function VariableSelect({
  setSelectedVariable,
  selectedVariable,
}: {
  selectedVariable: string;
  setSelectedVariable: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-col gap-4 w-36">
      <VariablesMenuDropdown
        selectedVariable={selectedVariable}
        setSelectedVariable={setSelectedVariable}
      />
    </div>
  );
}
