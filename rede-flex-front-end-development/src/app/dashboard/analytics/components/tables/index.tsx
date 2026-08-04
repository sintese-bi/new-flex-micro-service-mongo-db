"use client";
import { useEffect, useMemo, useState } from "react";
import { fuel } from "./columns/fuel";
import { group } from "./columns/group";
import { mobileColumns } from "./columns/mobile_columns";
import { regional_gallonage } from "./columns/regional_gallonage";
import { regional_product } from "./columns/regional_product";
import { workers_gallonage } from "./columns/workers_gallonage";
import { workers_products } from "./columns/workers_products";
import { MobileTable } from "./mobileTable";
import { DataTable } from "./table";
export default function DashboardComponentsTables({ data }: { data: any }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    // Set the initial value
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const RegionalGallonageComponent = useMemo(
    () =>
      isMobile ? (
        <MobileTable
          data={data.regional}
          fields={mobileColumns.regional_gallonage}
          title="Acompanhamento regional galonagem"
          messageTitle=""
          averageMeasure={[
            { label: "M/LT médio (R$/L)", value: data.regionalAvarageMLT },
            { label: "TMC médio (R$)", value: data.regionalAvarageTMC },
            { label: "TMV médio (L)", value: data.regionalAvarageTMV },
          ]}
          filterKey="name"
        />
      ) : (
        <DataTable
          data={data.regional}
          columns={regional_gallonage}
          title="Acompanhamento regional galonagem"
          messageTitle=""
          averageMeasure={[
            { label: "M/LT médio (R$/L)", value: data.regionalAvarageMLT },
            { label: "TMC médio (R$)", value: data.regionalAvarageTMC },
            { label: "TMV médio (L)", value: data.regionalAvarageTMV },
          ]}
        />
      ),
    [isMobile]
  );

  const RegionalProductComponent = useMemo(
    () =>
      isMobile ? (
        <MobileTable
          data={data.regional_produto}
          fields={mobileColumns.regional_product}
          title="Acompanhamento regional produto"
          messageTitle=""
          averageMeasure={[
            { label: "TMP médio (R$)", value: data.regionalAvarageTMP },
          ]}
          filterKey="name"
        />
      ) : (
        <DataTable
          data={data.regional_produto}
          columns={regional_product}
          title="Acompanhamento regional produto"
          messageTitle=""
          averageMeasure={[
            { label: "TMP médio (R$)", value: data.regionalAvarageTMP },
          ]}
        />
      ),
    [isMobile]
  );

  const FuelComponent = useMemo(
    () =>
      isMobile ? (
        <MobileTable
          data={data.combustivel}
          fields={mobileColumns.fuel}
          title="Acompanhamento da venda de combustiveis"
          messageTitle="Soma total por combustível"
          averageMeasure={data.grupo_bignumbers}
          filterKey="name"
          secondaryFilterKey="Combustivel"
        />
      ) : (
        <DataTable
          data={data.combustivel}
          columns={fuel}
          title="Acompanhamento da venda de combustiveis"
          messageTitle="Soma total por combustível"
          averageMeasure={data.grupo_bignumbers}
        />
      ),
    [isMobile]
  );

  const GroupComponent = useMemo(
    () =>
      isMobile ? (
        <MobileTable
          data={data.grupo}
          fields={mobileColumns.group}
          title="Acompanhamento da venda de produtos"
          messageTitle="Soma total por grupo de produto"
          averageMeasure={data.grupo_produto_bignumbers}
          filterKey="Posto"
          secondaryFilterKey="name"
          thirdFilterKey="Produto"
        />
      ) : (
        <DataTable
          data={data.grupo}
          columns={group}
          title="Acompanhamento da venda de produtos"
          messageTitle="Soma total por grupo de produto"
          averageMeasure={data.grupo_produto_bignumbers}
        />
      ),
    [isMobile]
  );

  const WorkersGallonageComponent = useMemo(
    () =>
      isMobile ? (
        <MobileTable
          data={data.frentista}
          fields={mobileColumns.workers_gallonage}
          title="Acompanhamento da galonagem por frentista"
          messageTitle=""
          filterKey="name"
          secondaryFilterKey="Regional"
        />
      ) : (
        <DataTable
          data={data.frentista}
          columns={workers_gallonage}
          messageTitle=""
          title="Acompanhamento da galonagem por frentista"
        />
      ),
    [isMobile]
  );

  const WorkersProductsComponent = useMemo(
    () =>
      isMobile ? (
        <MobileTable
          data={data.frentistaprod}
          fields={mobileColumns.workers_products}
          title="Acompanhamento de produto por frentista"
          messageTitle=""
          filterKey="name"
          secondaryFilterKey="Regional"
          thirdFilterKey="Posto"
        />
      ) : (
        <DataTable
          data={data.frentistaprod}
          columns={workers_products}
          messageTitle=""
          title="Acompanhamento de produto por frentista"
        />
      ),
    [isMobile]
  );

  return (
    <div className="flex flex-col gap-12 pb-6">
      {RegionalGallonageComponent}
      {RegionalProductComponent}
      {/**
       * <DataTable
        data={data.galonagem}
        columns={gallonage}
        title="Acompanhamento galonagem"
        messageTitle=""
        averageMeasure={[
          { label: "M/LT médio (R$/L)", value: data.stationAvarageMLT },
          { label: "TMC médio (R$)", value: data.stationAvarageTMC },
          { label: "TMV médio (L)", value: data.stationAvarageTMV },
        ]}
      />
      <DataTable
        data={data.produto}
        columns={product}
        title="Acompanhamento produtos"
        messageTitle=""
        averageMeasure={[
          { label: "TMP médio (R$)", value: data.regionalAvarageTMP },
        ]}
      />
       */}
      {FuelComponent}
      {GroupComponent}
      {WorkersGallonageComponent}
      {WorkersProductsComponent}
    </div>
  );
}
