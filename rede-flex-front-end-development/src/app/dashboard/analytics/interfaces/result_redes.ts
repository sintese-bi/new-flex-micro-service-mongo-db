export interface FuelResults {
  ARL: number;
  DA: number;
  EA: number;
  ET: number;
  GA: number;
  GC: number;
  GNV: number;
  GP: number;
  OA: number;
  OD: number;
  S10: number;
}

export const fuelLabelMap = {
  ARL: "Arla",
  DA: "Óleo Diesel B S10 Aditivada",
  EA: "Etanol Aditivado",
  ET: "Etanol Comum",
  GA: "Gasolina Aditivada",
  GC: "Gasolina Comum",
  GNV: "Gás Natural Veicular",
  GP: "Gasolina Premium",
  OA: "Óleo Diesel B S500 Aditivado",
  OD: "Óleo Diesel B S500 Comum",
  S10: "Óleo Diesel B S10 Comum",
} as const;

type FuelLabelMap = typeof fuelLabelMap;

export type ResultsRedeWithLabels = {
  [K in keyof FuelLabelMap as FuelLabelMap[K]]: number;
};

export const emptyFuelResults: FuelResults = {
  ARL: 0,
  DA: 0,
  EA: 0,
  ET: 0,
  GA: 0,
  GC: 0,
  GNV: 0,
  GP: 0,
  OA: 0,
  OD: 0,
  S10: 0,
};
