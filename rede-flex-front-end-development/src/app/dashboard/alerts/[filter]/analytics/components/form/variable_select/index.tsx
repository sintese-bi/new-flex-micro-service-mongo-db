import { VariablesInterfaces } from "../../../interfaces/variables";
import VariablesMenuDropdownFormComponentsAlerts from "./variables_menu_dropdown";
export default function VariableSelectFormComponentsAlerts({
  alertsVariables,
}: {
  alertsVariables: VariablesInterfaces[];
}) {
  return (
    <div className="flex flex-col gap-4  w-full">
      <VariablesMenuDropdownFormComponentsAlerts
        alertsVariables={alertsVariables}
      />
    </div>
  );
}
