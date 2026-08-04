"use client";
import { handleTMsAndBruteProfitUpdate } from "../../../../actions";
import { toast } from "@/components/ui/use-toast";
import SubmitButton from "./submit_button";
import { useContext, useState } from "react";
import { DashboardContext } from "../../../../context";
import Section from "./section";
export default function FormRede({
  data,
  fields,
  currentSecondarySection,
}: {
  data: any;
  fields: any;
  currentSection: 0 | 1 | 2;
  currentSecondarySection: 0 | 1 | 2 | 3;
}) {
  const { updateDashboardData } = useContext(DashboardContext);
  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(
      [...fields[0], ...fields[1]].map((field) => [
        field.name,
        data[field.name] || 0,
      ])
    )
  );
  function handleInputChange(name: string, value: string | number) {
    setFormValues((prev: any) => ({ ...prev, [name]: Number(value) }));
  }
  async function handleAction() {
    const response = await handleTMsAndBruteProfitUpdate(formValues);
    await updateDashboardData();
    toast({
      duration: 2000,
      variant: "default",
      title: "TMs e Lucro Bruto",
      description: response.message,
    });
  }
  return (
    <form action={handleAction} className="grid gap-4 py-4 space-y-4 px-2">
      <Section
        section={fields[currentSecondarySection]}
        data={formValues}
        onInputChange={handleInputChange}
      />
      <SubmitButton />
    </form>
  );
}
