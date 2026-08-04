export const redeSectionsFields = {
  0: [
    //{
    //  name: "use_mlt",
    //  label: "Margem por litro - MLT (R$/L)",
    //},
    {
      name: "use_tmc",
      label: "Ticket médio de combustível - TMC (R$)",
    },
    {
      name: "use_tmf",
      label: "Ticket médio de faturamento - TMF (R$)",
    },
    {
      name: "use_tmp",
      label: "Ticket médio de produto - TMP (R$)",
    },
    {
      name: "use_tmvol",
      label: "Ticket médio de volume - TMVOL (R$)",
    },
    {
      name: "use_lucro_bruto_operacional",
      label: "Lucro Bruto - LB (%)",
    },
    {
      name: "use_lucro_bruto_operacional_galonagem",
      label: "Resultado Bruto - RB Galonagem (R$)",
    },
    {
      name: "use_lucro_bruto_operacional_produto",
      label: "Resultado Bruto - RB Produto (R$)",
    },
  ],
  1: [
    {
      name: "use_gasolina_comum_comb",
      label: "Gasolina comum (R$)",
    },
    {
      name: "use_etanol_comum_comb",
      label: "Etanol comum (R$)",
    },
    {
      name: "use_oleo_diesel_b_s10_comum_comb",
      label: "Diesel S10 comum (R$)",
    },
    {
      name: "use_oleo_diesel_b_s500_comum_comb",
      label: "Diesel S500 comum (R$)",
    },
  ],
  2: [
    {
      accessorKey: "invoice_comb",
      header: "Faturamento combustível",
      isVisible: false,
      isInputField: true,
    },
    {
      accessorKey: "invoice_prod",
      header: "Faturamento produto",
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
