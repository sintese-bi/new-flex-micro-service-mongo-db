"use client";
import ValueAndType from "./value_and_type";
import WhatsAppNumber from "./whatsapp_number";
import { handleAlertsUpdate } from "../../../actions";
import VariableSelect from "./variable_select";
import SubmitButton from "./submit";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function FormComponentsAlertsTable({
  ibm_id,
  gas_station_whats_app,
  variables,
}: {
  ibm_id: string;
  gas_station_whats_app: string;
  variables: { [key: string]: number };
}) {
  const { filter } = useParams<{ filter: string }>();
  const [selectedVariable, setSelectedVariable] = useState<string>(
    "TM Vol Gasolina Comum"
  );
  const [selectedVariableValue, setSelectedVariableValue] = useState<number>(
    variables[selectedVariable]
  );
  useEffect(() => {
    setSelectedVariableValue(variables[selectedVariable]);
  }, [selectedVariable, variables]);
  async function handleFormSubmit(form: FormData) {
    const { message } = await handleAlertsUpdate(form, ibm_id, filter);
    toast({
      variant: "default",
      duration: 1500,
      title: "Alerta configurado",
      description: message,
    });
  }
  return (
    <form
      className="flex flex-row w-full justify-end items-center gap-4"
      action={handleFormSubmit}
    >
      <VariableSelect
        selectedVariable={selectedVariable}
        setSelectedVariable={setSelectedVariable}
      />
      <ValueAndType selectedVariableValue={selectedVariableValue} />
      <WhatsAppNumber gas_station_whats_app={gas_station_whats_app} />
      <SubmitButton />
    </form>
  );
}
