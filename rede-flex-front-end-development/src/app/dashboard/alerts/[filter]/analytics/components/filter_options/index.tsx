"use client";
import { Dispatch, SetStateAction } from "react";
import CompanyOrRegional from "./company_or_regional";
import FuelOrProduct from "./fuel_or_product";
export default function FilterOptions() {
  return (
    <div className="flex lg:flex-row md:flex-row flex-col justify-start lg:items-center md:items-center items-start gap-6 py-6">
      <CompanyOrRegional />
      <FuelOrProduct />
    </div>
  );
}
