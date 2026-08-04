"use server";
import { revalidateTag } from "next/cache";
import { VariablesInterfaces } from "../interfaces/variables";
import { apiRequestConfig, getUserUUID } from "@/utils";
export async function handleAlertsVariables(): Promise<string[]> {
  return [
    "TM Vol Gasolina Comum",
    "TM Vol Gasolina Premium",
    "TM Vol Gasolina Podium",
    "TM Vol Diesel S500",
    "TM Vol Diesel S10",
    "TM Vol Etanol Comum",
  ];
}
export async function handleAlertsVariablesSelect(form: FormData) {
  revalidateTag("alerts_variables");
}
export async function handleAlertsVariablesUnselect(variable: string) {
  revalidateTag("alerts_variables");
}
export async function handleAlertsLogs(): Promise<any> {
  const use_uuid = getUserUUID();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERN_API}/alerts-log`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
      method: "POST",
      body: JSON.stringify({ use_uuid }),
    }
  );
  const data = await response.json();
  //const sanados = data["sanados"];
  //const qntdsanados = data["quant_sanados"];
  //const naosanados = data["nãoSanados"];
  return { sanados: [] };
}
export async function handleAlertsTable(filter: string): Promise<any> {
  const use_uuid = getUserUUID();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERN_API}/name-table/${filter}`,
    {
      method: "POST",
      cache: "no-cache",
      headers: apiRequestConfig(),
      body: JSON.stringify({
        use_uuid,
      }),
    }
  );
  const { data } = await response.json();
  const formmated_data = data.map((data_item: any) => {
    const telephones_array = data_item.gas_whats_app || [""];
    const telephones_formmated = telephones_array.map((telefone: string) =>
      telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1)$2$3 ")
    );
    const telephones_string = telephones_formmated.join(" ");
    const formmated_item = {
      name: data_item.name,
      gas_station_whats_app: telephones_string,
      gas_station_id: data_item.gas_id,
      variables: data_item.variables,
      "Configurar alerta": "margin_min_value",
    };
    return formmated_item;
  });
  return formmated_data;
}

export async function handleAlertsUpdate(
  form: FormData,
  ibm_id: string,
  filter: string
): Promise<any> {
  const use_uuid = getUserUUID();
  const variable_name = form.get("variable");
  const variable_value = Number(form.get("margin_min_value"));
  const value_type = isMarginTypeValueAbsolute(
    form.get("margin_min_value_type") as string
  );
  const telephones: string[] = getTelephones(
    form.get("whatsapp_contact") as string
  );
  const body = {
    use_uuid,
    ibm_id,
    variable_name,
    value_type,
    variable_value,
    telephones,
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERN_API}/update-alert/${filter}`,
    {
      method: "POST",
      cache: "no-cache",
      headers: apiRequestConfig(),
      body: JSON.stringify(body),
    }
  );
  const json_response = await response.json();
  return json_response;
}

// function to return the telephones field
function getTelephones(telephones_string: string) {
  const telephones_formmated = telephones_string.replace(/[()]/g, "");
  const telephones_spplited = telephones_formmated.split(" ");
  const telephones: string[] = [];
  for (const item of telephones_spplited) {
    item.length != 0 ? telephones.push(item) : null;
  }
  return telephones;
}

// function to return false if the margin type value is absolute
function isMarginTypeValueAbsolute(type: string) {
  return type == "absolute" ? false : true;
}

// function to return the variables and alerts values
function gettingVariablesAndAlerts(existentContent: any): {
  variables: VariablesInterfaces[];
  alerts: any;
} {
  const { variables, alerts } = existentContent;
  return { variables, alerts };
}

//function to return the updated variables and alerts values
function gettingUpdatedVariables(
  variables: VariablesInterfaces[],
  variable: FormDataEntryValue | null,
  whatsapp_contact: FormDataEntryValue | null,
  margin_min_value: FormDataEntryValue | null,
  margin_min_value_type: FormDataEntryValue | null
) {
  return variables.map((variablesItem) => {
    return variablesItem.label === variable
      ? {
          ...variablesItem,
          value: !variablesItem.value,
          whatsapp_contact,
          margin_min_value,
          margin_min_value_type,
        }
      : variablesItem;
  });
}
