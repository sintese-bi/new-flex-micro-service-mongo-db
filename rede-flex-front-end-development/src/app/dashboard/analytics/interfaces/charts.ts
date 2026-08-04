export interface ChartsInterfaces {
  title: string;
  labels: Array<string>;
  datasets: {
    profit: Array<number>;
    sold_volume: Array<number>;
    cost: Array<number>;
    fuel_margin: Array<number>;
  };
}
