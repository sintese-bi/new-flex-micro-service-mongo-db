import { handleTMsAndBruteProfitPerStationUpdate } from "@/app/dashboard/analytics/actions";
import RowForm from "../forms_table/form";
export interface IStationsSectionsFields {
  accessorKey: string;
  header: string;
  cell?: any;
  isVisible: boolean;
  isInputField: boolean;
}
export const stationsSectionsFields: {
  0: IStationsSectionsFields[];
  1: IStationsSectionsFields[];
  2: IStationsSectionsFields[];
  3: IStationsSectionsFields[];
} = {
  0: [
    {
      accessorKey: "id",
      header: "ID",
      isVisible: false,
      isInputField: false,
    },
    {
      accessorKey: "name",
      header: "Posto",
      cell: ({ row }: { row: any }) => {
        return <p className="min-w-[320px]">{row.original.name}</p>;
      },
      isVisible: true,
      isInputField: false,
    },
    //{
    //  accessorKey: "mlt",
    //  header: "MLT (R$/L)",
    //  isVisible: false,
    //  isInputField: true,
    //},
    {
      accessorKey: "tmp",
      header: "TMP (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "tmf",
      header: "TMF (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "tmc",
      header: "TMC (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "tmvol",
      header: "TMVOL (L)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "tm_lucro_bruto_operacional",
      header: "LB (%)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "tm_lucro_bruto_operacional_galonagem",
      header: "RB Gal. (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "tm_lucro_bruto_operacional_produto",
      header: "RB Produto (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "form",
      header: "Configurar postos",
      cell: ({ row }: { row: any }) => {
        const row_values = { ...row.original };
        delete row_values["id"];
        delete row_values["nome_fantasia"];
        return (
          <RowForm
            id={row.original.id}
            rowValues={row_values}
            updateFunction={handleTMsAndBruteProfitPerStationUpdate}
          />
        );
      },
      isVisible: true,
      isInputField: false,
    },
  ],
  1: [
    {
      accessorKey: "gasolina_comum",
      header: "Gasolina comum (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "etanol_comum",
      header: "Etanol comum (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "oleo_diesel_b_s500_comum",
      header: "Diesel S500 comum (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "oleo_diesel_b_s10_comum",
      header: "Diesel S10 comum (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "freight_value",
      header: "Frete (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "bonus_value",
      header: "Bônus (R$)",
      isVisible: false,
      isInputField: true,
    },
  ],
  2: [
    {
      accessorKey: "invoice_comb",
      header: "Galonagem (L)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "invoice_prod",
      header: "Faturamento de produto (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "gross_result_literage",
      header: "RB Galonagem (R$)",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "gross_result_product",
      header: "RB  Produto (R$)",
      isVisible: false,
      isInputField: true,
    },
  ],
  3: [
    {
      accessorKey: "invoice_comb_daily",
      header: "Faturamento combustível diário",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "invoice_prod_daily",
      header: "Faturamento produto diário",
      isVisible: false,
      isInputField: true,
    },
  ],
};
