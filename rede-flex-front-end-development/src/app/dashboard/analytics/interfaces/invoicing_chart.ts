export interface InvoiceType {
  ibm: string;
  media: number;
  name: string;
  value: string;
}

export interface InvoicingDataChartType {
  fatCombustivel: InvoiceType[];
  fatProduto: InvoiceType[];
}
