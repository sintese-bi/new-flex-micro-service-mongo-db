import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { handleAlertsVariables } from "../../../../actions";
export default function VariablesMenuDropdown({
  selectedVariable,
  setSelectedVariable,
}: {
  selectedVariable: string;
  setSelectedVariable: Dispatch<SetStateAction<string>>;
}) {
  const [alertsVariables, setAlertsVariables] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await handleAlertsVariables();
      setAlertsVariables(response);
    };
    fetch();
  }, []);

  function handleValueChange(value: string) {
    setSelectedVariable(value);
  }
  return (
    <Select
      name="variable"
      onValueChange={handleValueChange}
      defaultValue="TM Vol Gasolina Comum"
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Variáveis" />
      </SelectTrigger>
      <SelectContent>
        {alertsVariables.map((variable, index) => (
          <SelectItem key={index} value={variable}>
            {variable}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
