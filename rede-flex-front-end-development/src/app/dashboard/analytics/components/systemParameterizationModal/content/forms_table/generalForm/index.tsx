import {
  handleGeneralTMSAndBruteProfitPerRegionalUpdate,
  handleGeneralTMSAndBruteProfitPerStationUpdate,
} from "@/app/dashboard/analytics/actions";
import { DashboardContext } from "@/app/dashboard/analytics/context";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useContext, useEffect, useState } from "react";
import { SystemParameterizationModalContext } from "../../../context";
import { sectionsFields } from "../../fields";
import { IRegionalsSectionsFields } from "../../fields/regional";
import { IStationsSectionsFields } from "../../fields/station";
import Section from "../form/section";
import SubmitButton from "../form/submit_button";

export default function GeneralForm({}: {}) {
  const { updateDashboardData } = useContext(DashboardContext);
  const {
    data,
    generalData,
    handleData,
    currentSection,
    currentSecondarySection,
  } = useContext(SystemParameterizationModalContext)!;
  const [formValues, setFormValues] = useState({});
  function handleInputChange(name: string, value: string | number) {
    setFormValues((prev: any) => ({ ...prev, [name]: Number(value) }));
  }
  async function handleAction() {
    const updateFunction = {
      1: handleGeneralTMSAndBruteProfitPerStationUpdate,
      2: handleGeneralTMSAndBruteProfitPerRegionalUpdate,
    };
    const response = await updateFunction[currentSection as 1 | 2](formValues);
    await handleData(currentSection);
    await updateDashboardData();
    toast({
      duration: 1000,
      variant: "default",
      title: "TMs e Lucro Bruto",
      description: response.message,
    });
  }
  useEffect(() => {
    setFormValues(generalData);
  }, [generalData]);
  const section = sectionsFields[currentSection][currentSecondarySection] as
    | IStationsSectionsFields[]
    | IRegionalsSectionsFields[];
  return (
    <div className="flex-col gap-6 hidden md:flex">
      <div className="w-full font-bold text-sm">
        <p>Formulário geral</p>
      </div>
      <p className="font-bold text-sm text-slate-400 w-full word-break">
        (Atenção! Não utilizar essa funcionalidade pois ela pode alterar todos
        <br />
        os valores preenchidos nas metas de galonagem & produto e nos descontos
        <br />
        de combustíveis)
      </p>
      <form action={handleAction} className="flex gap-2 items-end w-full">
        <Section
          section={section}
          data={formValues}
          onInputChange={handleInputChange}
        />
        <SubmitButton />
      </form>
      <Separator />
    </div>
  );
}
