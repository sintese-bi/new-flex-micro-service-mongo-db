import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VariablesInterfaces } from "../../../interfaces/variables";
export default function VariablesMenuDropdownFormComponentsAlerts({
  alertsVariables,
}: {
  alertsVariables: VariablesInterfaces[];
}) {
  const selectedVariables = alertsVariables.filter(
    ({ value }) => value !== false
  );
  function handleVariablesAlreadySelected(variable: string) {
    const variableIsSelected = selectedVariables.find(
      ({ label }) => label == variable
    );
    if (!variableIsSelected) return false;
    return true;
  }
  return (
    <Select name="variable">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Variáveis" />
      </SelectTrigger>
      <SelectContent>
        {alertsVariables.map(({ label }, index) => (
          <SelectItem
            key={index}
            value={label}
            disabled={handleVariablesAlreadySelected(label)}
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
