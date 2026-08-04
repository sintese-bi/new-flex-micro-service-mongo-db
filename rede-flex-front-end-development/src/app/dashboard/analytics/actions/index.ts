"use server";
import { mongodb_client } from "@/database/connection";
import {
  apiRequestConfig,
  getAccessToken,
  microServiceRequestConfig,
} from "@/utils";
import { ObjectId } from "mongodb";
import { BigNumbersInterfaces } from "../interfaces/big_numbers";
import { ChartsInterfaces } from "../interfaces/charts";
import { GrossDailyPerStationType } from "../interfaces/gross_daily_per_station";
import { InvoicingDataChartType } from "../interfaces/invoicing_chart";
import { FuelResults } from "../interfaces/result_redes";

export async function handleDashboardBigNumbers(): Promise<
  BigNumbersInterfaces[][]
> {
  const response = await fetch(
    `${
      process.env.NEXT_MICROSERVICE_MONGODB
    }/sum-fuel-literage/${getAccessToken()}`,
    {
      headers: microServiceRequestConfig(),
      cache: "no-cache",
    }
  );
  const json = await response.json();
  const { data }: { data: BigNumbersInterfaces[][] } = json;
  return data;
}
export async function fetchMLTs(): Promise<any> {
  const response = await fetch(
    `${
      process.env.NEXT_MICROSERVICE_MONGODB
    }/bignumbers-mlt/${getAccessToken()}`,
    {
      headers: microServiceRequestConfig(),
      cache: "no-cache",
    }
  );
  const json = await response.json();
  const { data }: { data: BigNumbersInterfaces[][] } = json;
  return data;
}

export async function fetchResultsRede(): Promise<FuelResults> {
  const url = `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/resultRede`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "GET",
  });

  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );

  const data = await response.json();
  return data;
}

export async function handleDashboardCharts(): Promise<ChartsInterfaces[]> {
  const redeflex = mongodb_client.db("redeflex");
  const collection = redeflex.collection("dashboard");
  const { charts }: { charts: ChartsInterfaces[] } = (await collection.findOne({
    _id: new ObjectId("668953f2e6120c73f62c0a9c"),
  })) as any;
  return charts;
}
export async function handleDashboardDailyFuelChart(params: {
  week_day: string;
  variable_type: string;
}): Promise<{ date: string; sum: number }[]> {
  const url = `${process.env.NEXT_MICROSERVICE_MONGODB}/daily-graphic-fuel`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const { data } = await response.json();
  return data;
}
export async function handleDashboardDailyProductChart(params: {
  week_day: string;
  variable_type: string;
}): Promise<{ date: string; sum: number }[]> {
  const url = `${process.env.NEXT_MICROSERVICE_MONGODB}/daily-graphic-product`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const { data } = await response.json();
  return data;
}
export async function handleDashboardRegionalFuelChart(params: {
  variable_type: string;
}): Promise<{ date: string; sum: number }[]> {
  const url = `${process.env.NEXT_MICROSERVICE_MONGODB}/regional-chart-fuel`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const data = await response.json();
  return data;
}
export async function handleDashboardGrossDailyPerStation(params: {
  variable_type: string;
}) {
  const url = `${
    process.env.NEXT_MICROSERVICE_MONGODB
  }/gross-daily-per-station/${getAccessToken()}/${params.variable_type}`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const { data } = await response.json();
  return data as GrossDailyPerStationType[];
}
export async function handleDashboardGrossDaily(params: {
  variable_type: string;
}) {
  const url = `${
    process.env.NEXT_MICROSERVICE_MONGODB
  }/gross-daily/${getAccessToken()}/${params.variable_type}`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const { data } = await response.json();
  return data;
}
export async function handleDashboardRegionalStationChart(params: {
  variable_type: string;
  regional_type: string;
  filter: number;
}): Promise<{ date: string; sum: number }[]> {
  const url = `${process.env.NEXT_MICROSERVICE_MONGODB}/regional-graph/${params.filter}`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const data = await response.json();
  return data;
}
export async function handleDashboardDailyStationChart(params: {
  variable_type: string;
  week_day: string;
  filter: number;
}): Promise<{ date: string; sum: number }[]> {
  const url = `${process.env.NEXT_MICROSERVICE_MONGODB}/daily-graph/${params.filter}`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const data = await response.json();
  return data;
}
export async function handleDashboardRegionalProductChart(params: {
  variable_type: string;
}): Promise<{ date: string; sum: number }[]> {
  const url = `${process.env.NEXT_MICROSERVICE_MONGODB}/regional-chart-product`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "POST",
    body: JSON.stringify(params),
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const data = await response.json();
  return data;
}
export async function handleDashboardInvoicingChart(params: {
  variable_type: string;
}): Promise<InvoicingDataChartType> {
  const url = `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/fatibm`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "GET",
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const data = await response.json();
  return data as InvoicingDataChartType;
}
export async function handleDashboardLinearInvoicingChart(params: {
  variable_type: string;
}): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/ibmhist`;
  const response = await fetch(url, {
    cache: "no-cache",
    headers: microServiceRequestConfig(),
    method: "GET",
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const data = await response.json();
  return data;
}
export async function handleDataframes() {
  const url = `${
    process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API
  }/dataframes?token=${getAccessToken()}`;
  const response = await fetch(url, {
    headers: microServiceRequestConfig(),
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  function parseFormattedNumber(formattedString: string) {
    return Number(formattedString.replace(/\./g, "").replace(",", "."));
  }
  const dataframes = await response.json();
  const regionalAvarageMLT = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(dataframes["regionalGalonagemMLTMedio"]));
  const regionalAvarageTMP = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(dataframes["regionalProdTMPMedio"]));
  const regionalAvarageTMC = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(dataframes["TMCMedioPosto"]));
  const regionalAvarageTMV = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(dataframes["TMVMedioRegional"]));
  const stationAvarageMLT = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(dataframes["MLTMedioPostos"]));
  const stationAvarageTMP = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(dataframes["TMPMedioPosto"]));
  const stationAvarageTMC = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(dataframes["TMCMedioPosto"]));
  const stationAvarageTMV = Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(dataframes["TMVMedioPosto"]));
  const combustivel = dataframes["combustivel"].map((item: any) => {
    return {
      name: item["Nome da Empresa"],
      Combustivel: item["Combustivel"],
      Venda: item["Venda"],
      Volume: item["Volume"],
      Custo: item["Custo"],
      Resultado: item["Resultado"] ? 0 : 2,
      Lucro: item["Lucro"],
      "Lucro Com Desconto": item["Lucro Com Desconto"],
      "LBO Combsutivel": item["LBO Combsutivel"],
      "Rendimento Bruto": item["Rendimento Bruto"],
      "M/LT": item["M/LT"],
      "Hora da Venda": item["Hora da Venda"],
    };
  });
  const grupo = dataframes["grupo"].map((item: any) => {
    return {
      name: item["Grupo"],
      Posto: item["Posto"],
      Abast: item["abast"],
      TMP: item["TMP"],
      "LBO Produto": item["LBO Produto"],
      Produto: item["Produto"],
      Resultado: item["Resultado"] ? 0 : 2,
      Quantidade: item["Quantidade"],
      "Cod Produto": item["Cod Produto"],
      Custo: item["Custo"],
      Lucro: item["Lucro"],
      Faturamento: item["Faturamento"],
    };
  });
  const grupo_bignumbers = dataframes["a_group_combustivel"].map(
    (item: any) => {
      return {
        label: item["Combustivel"],
        value: `R$ ${Intl.NumberFormat("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(item["Lucro Com Desconto"])}`,
      };
    }
  );
  const grupo_produto_bignumbers = dataframes["a_group_prod"].map(
    (item: any) => {
      return {
        label: item["Grupo"],
        value: `R$ ${Intl.NumberFormat("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(item["Lucro"])}`,
      };
    }
  );
  const galonagem = dataframes["galonagem"].map((item: any) => {
    return {
      name: item["Posto"],
      regional: item["Regional"],
      Abastecimentos: item["Abastecimentos"],
      "Galonagem(Litro)": item["Galonagem(Litro)"],
      Faturamento: item["Faturamento"],
      "Rendimento Bruto": item["Rendimento Bruto"],
      "Resultado Bruto": item["Resultado Bruto"],
      Galonagem: item["Galonagem"],
      Custo: item["Custo"],
      Lucro: item["Lucro"],
      "Lucro Bruto Operacional Galonagem": item["Lucro Operacional Galonagem"],
      "Lucro com Desconto": item["Lucro com Desconto"],
      TMC: item["TMC"],
      TMF: item["TMF"],
      TMV: item["TMV"],
      "M/LT": item["M/LT"],
      Posto_ibm: item["Posto_ibm"],
      Indicador: item["Indicador"],
      Resultado: item["Resultado"],
      "Última Atualizacao": item["Última Atualizacao"],
    };
  });
  const produto = dataframes["produto"].map((item: any) => {
    return {
      name: item["Posto"],
      regional: item["Regional"],
      "Abastecimentos(Produto)": item["Abastecimentos(Produto)"],
      QtdProdutosVendidos: item["QtdProdutosVendidos"],
      "Valor Vendido": item["Valor Vendido"],
      "Rendimento Bruto": item["Rendimento Bruto"],
      "Resultado Bruto": item["Resultado Bruto"],
      Custo: item["Custo"],
      Lucro: item["Lucro"],
      "Lucro Operacional Produto": item["Lucro Operacional Produto"],
      TMC: item["TMC"],
      TMP: item["TMP"],
      Posto_ibm: item["Posto_ibm"],
      Indicador: item["Indicador"],
      Resultado: item["Resultado"],
      "Última Atualizacao": item["Última Atualizacao"],
    };
  });
  const regional = dataframes["regional"].map((item: any) => {
    return {
      name: item["Regional"],
      Abastecimentos: item["Abastecimentos"],
      Faturamento: item["Faturamento"],
      "Rendimento Bruto": item["Rendimento Bruto"],
      "Resultado Bruto": item["Resultado Bruto"],
      Galonagem: item["Galonagem"],
      Custo: item["Custo"],
      "Custo com Desconto": item["Custo com Desconto"],
      Lucro: item["Lucro"],
      "Lucro com Desconto": item["Lucro com Desconto"],
      "Lucro Bruto Operacional Galonagem":
        item["Lucro Bruto Operacional Galonagem"],
      TMC: item["TMC"],
      TMF: item["TMF"],
      TMV: item["TMV"],
      "M/LT": item["M/LT"],
      stations: galonagem.filter(
        (product_item: any) => product_item.regional == item["Regional"]
      ),
      Indicador: item["Indicador"],
      Resultado: item["Resultado"],
    };
  });
  const regional_produto = dataframes["regional_produto"].map((item: any) => {
    return {
      name: item["Regional"],
      Abastecimentos: item["Abastecimentos(Produto)"],
      QtdProdutosVendidos: item["QtdProdutosVendidos"],
      "Valor Vendido": item["Valor Vendido"],
      "Rendimento Bruto": item["Rendimento Bruto"],
      "Resultado Bruto": item["Resultado Bruto"],
      Custo: item["Custo"],
      Lucro: item["Lucro"],
      "Lucro Bruto Operacional Produto":
        item["Lucro Bruto Operacional Produto"],
      TMP: item["TMP"],
      stations: produto.filter(
        (product_item: any) => product_item.regional == item["Regional"]
      ),
      Indicador: item["Indicador"],
      Resultado: item["Resultado"],
    };
  });

  const frentista = dataframes["frentista"].map((item: any) => {
    return {
      User_id: item["User_id"],
      name: item["Nome"],
      Posto: item["Posto"],
      Regional: item["Regional"],
      Galonagem: item["Galonagem"],
      Resultado: undefined,
      "M/LT": item["M/LT"],
      "LBO Combustivel": item["LBO Combustivel"],
      "Rendimento Bruto": item["LBO Combustivel"],
      "Combustivel Vendido": item["Combustivel Vendido"],
      Venda: item["Venda"],
      Custo: item["Custo"],
      Lucro: item["Lucro"],
      ibm: item["ibm"],
    };
  });
  const frentistaprod = dataframes["frentistaprod"].map((item: any) => {
    return {
      User_id: item["User_id"],
      name: item["Nome"],
      Posto: item["Posto"],
      Regional: item["Regional"],
      "Produto Vendido": item["Produto Vendido"],
      Quantidade: item["Quantidade"],
      Resultado: undefined,
      "LBO Produto": item["LBO Produto"],
      Venda: item["Venda"],
      Custo: item["Custo"],
      Lucro: item["Lucro"],
      ibm: item["ibm"],
    };
  });
  const lowerThanAvarageCount = {
    "M/LT": galonagem.filter(
      (item: any) =>
        Number(item["M/LT"]) < parseFormattedNumber(stationAvarageMLT)
    ).length,
    TMP: produto.filter(
      (item: any) =>
        Number(item["TMP"]) < parseFormattedNumber(stationAvarageTMP)
    ).length,
  };
  return {
    galonagem,
    produto,
    regional,
    regional_produto,
    combustivel,
    grupo,
    grupo_bignumbers,
    grupo_produto_bignumbers,
    frentista,
    frentistaprod,
    lowerThanAvarageCount,
    stationAvarageMLT,
    stationAvarageTMP,
    stationAvarageTMC,
    stationAvarageTMV,
    regionalAvarageMLT,
    regionalAvarageTMP,
    regionalAvarageTMC,
    regionalAvarageTMV,
  };
}
export async function handleGallonageRankingByStation(ibm: string) {
  const url = `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/ranking?ibm=${ibm}`;
  const response = await fetch(url, {
    headers: microServiceRequestConfig(),
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const { ranking } = await response.json();
  const formmatedRanking = ranking.map((item: any) => {
    return {
      ...item,
      name: item["Nome"],
      User_id: item["User_id"],
      Venda: item["Venda"],
      Galonagem: item["Galonagem"],
      Custo: item["Custo"],
      Lucro: item["Lucro"],
      TMC: item["TMC"],
      TMF: item["TMF"],
      TMV: item["TMV"],
    };
  });
  return formmatedRanking;
}
export async function handleProductRankingByStation(ibm: string) {
  const url = `${process.env.NEXT_PUBLIC_DATAFRAME_EXTERN_API}/prodranking?ibm=${ibm}`;
  const response = await fetch(url, {
    headers: microServiceRequestConfig(),
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const { ranking } = await response.json();
  const formmatedRanking = ranking.map((item: any) => {
    return {
      ...item,
      name: item["Nome"],
      User_id: item["User_id"],
      Venda: item["Venda"],
      Produtos: item["Produtos"],
      Custo: item["Custo"],
      Lucro: item["Lucro"],
      TMC: item["TMC"],
      TMP: item["TMP"],
    };
  });
  return formmatedRanking;
}
export async function handleGeolocations() {
  const url = `${
    process.env.NEXT_PUBLIC_EXTERN_API
  }/map-position/${getAccessToken()}`;
  const response = await fetch(url, {
    headers: apiRequestConfig(),
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(
      `Erro de ${
        response.statusText || "unknown"
      } ao fazer requisição na rota: ${url}`
    );
  const { data } = await response.json();
  const formmatedNumbers = data.map((data_item: any) => {
    return {
      ...data_item,
      "Venda de Combustível": new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(data_item["Venda de Combustível"]),
      "Produtos vendidos": new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(data_item["Produtos vendidos"]),
      Galonagem: new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(data_item["Galonagem"]),
    };
  });
  return formmatedNumbers;
}
export async function handleTMsAndBruteProfit() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERN_API}/modal-return-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
    }
  );
  const data = await response.json();
  return data;
}
export async function handleTMsAndBruteProfitUpdate(values: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERN_API}/modal-insert-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
      method: "POST",
      body: JSON.stringify(values),
    }
  );
  const data = await response.json();
  return data;
}
export async function handleTMsAndBruteProfitPerStation() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_EXTERN_API
    }/modal-station-return-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
    }
  );
  const { data } = await response.json();
  const formattedData = data.map((item: any) => {
    return { ...item, name: item.nome_fantasia };
  });
  return { data: formattedData };
}
export async function handleTMsAndBruteProfitPerStationUpdate(params: any) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_EXTERN_API
    }/modal-station-insert-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
      method: "POST",
      body: JSON.stringify(params),
    }
  );
  if (!response.ok) console.error(await response.text());
  const data = await response.json();
  return data;
}
export async function handleGeneralTMSAndBruteProfitPerStation() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_EXTERN_API
    }/modal-station-general-return-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
    }
  );
  const data = await response.json();
  return data;
}
export async function handleGeneralTMSAndBruteProfitPerStationUpdate(
  params: any
) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_EXTERN_API
    }/modal-station-general-insert-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
      method: "POST",
      body: JSON.stringify(params),
    }
  );
  if (!response.ok) console.error(await response.text());
  const data = await response.json();
  return data;
}
export async function handleTMsAndBruteProfitPerRegional() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_EXTERN_API
    }/modal-regions-return-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
    }
  );
  const { data } = await response.json();
  const formattedData = data.map((item: any) => {
    return { ...item, name: item.region_name };
  });
  return { data: formattedData };
}
export async function handleTMsAndBruteProfitPerRegionalUpdate(params: any) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_EXTERN_API
    }/modal-regions-insert-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
      method: "POST",
      body: JSON.stringify(params),
    }
  );
  if (!response.ok) console.error(await response.text());
  const data = await response.json();
  return data;
}
export async function handleGeneralTMSAndBruteProfitPerRegional() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_EXTERN_API
    }/modal-regions-general-return-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
    }
  );
  const data = await response.json();
  return data;
}
export async function handleGeneralTMSAndBruteProfitPerRegionalUpdate(
  params: any
) {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_EXTERN_API
    }/modal-regions-general-insert-tm/${getAccessToken()}`,
    {
      cache: "no-cache",
      headers: apiRequestConfig(),
      method: "POST",
      body: JSON.stringify(params),
    }
  );
  if (!response.ok) console.error(await response.text());
  const data = await response.json();
  return data;
}
