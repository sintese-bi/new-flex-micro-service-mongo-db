import { VariablesInterfaces } from "../../interfaces/variables";
import SelectedVariablesAlerts from "./selected_variables";
import SubmitButtonAlerts from "./submit_button";
import ValueAndTypeComponentsAlerts from "./value_and_type";
import VariableSelectFormComponentsAlerts from "./variable_select";
import WhatsAppNumberComponentsAlerts from "./whatsapp_number";
export default async function FormComponentsAlerts({
  handleAlertsVariables,
  handleAlertsVariablesSelect,
}: {
  handleAlertsVariables: () => Promise<VariablesInterfaces[]>;
  handleAlertsVariablesSelect: (form: FormData) => Promise<void>;
}) {
  const alertsVariables = await handleAlertsVariables();
  return (
    <div className="text-slate-200 text-sm">feature is begin developed</div>
  );
}
