-- CreateTable
CREATE TABLE "ibm_info" (
    "ibm" VARCHAR(255),
    "nomefantasia" VARCHAR(255),
    "cnpj" VARCHAR(255),
    "razaosocial" VARCHAR(255),
    "cep" VARCHAR(255),
    "lat" DOUBLE PRECISION,
    "long" DOUBLE PRECISION,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "endereco" VARCHAR(255),
    "regional" VARCHAR(255),
    "ibm_margin_GC" DOUBLE PRECISION[],
    "ibm_margin_GASOLINA_PODIUM" DOUBLE PRECISION[],
    "ibm_margin_GASOLINA_PREMIUM" DOUBLE PRECISION[],
    "ibm_margin_DIESEL_GROUP" DOUBLE PRECISION[],
    "ibm_margin_DIESEL_GROUP_S500" DOUBLE PRECISION[],
    "ibm_margin_ETANOL_COMUM" DOUBLE PRECISION[],
    "ibm_margin_TOTAL_PRODUCT" DOUBLE PRECISION[],
    "ibm_margin_ADITIVOS_AUTOMOVEIS_PRODUCT" DOUBLE PRECISION[],
    "ibm_margin_FILTROS_AR_PRODUCT" DOUBLE PRECISION[],

    CONSTRAINT "ibm_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "use_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "use_name" VARCHAR(100),
    "use_email" VARCHAR(50),
    "use_password" VARCHAR(255),
    "use_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "use_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "use_date_expire" TIMESTAMP(3),
    "use_token" VARCHAR(255),
    "use_level" VARCHAR(20),
    "use_whats_app" VARCHAR(255)[],
    "use_mlt" DOUBLE PRECISION,
    "use_tmc" DOUBLE PRECISION,
    "use_tmf" DOUBLE PRECISION,
    "use_tmp" DOUBLE PRECISION,
    "use_tmvol" DOUBLE PRECISION,
    "use_lucro_bruto_operacional_galonagem" DOUBLE PRECISION,
    "use_lucro_bruto_operacional_produto" DOUBLE PRECISION,
    "use_lucro_bruto_operacional" DOUBLE PRECISION,
    "use_ETANOL_COMUM_comb" DOUBLE PRECISION,
    "use_GASOLINA_COMUM_comb" DOUBLE PRECISION,
    "use_OLEO_DIESEL_B_S10_COMUM_comb" DOUBLE PRECISION,
    "use_OLEO_DIESEL_B_S500_COMUM_comb" DOUBLE PRECISION,

    CONSTRAINT "users_pkey" PRIMARY KEY ("use_uuid")
);

-- CreateTable
CREATE TABLE "gas_station_setvariables" (
    "gas_station_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gas_station_marginGC" DOUBLE PRECISION,
    "gas_station_type_marginGC" BOOLEAN,
    "gas_station_whats_app" VARCHAR(255)[],
    "gas_station_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gas_station_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ibm_info_id" UUID,
    "use_uuid" UUID,
    "verification_msg_sent" BOOLEAN DEFAULT false,
    "verification_hour_marginGC" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "gas_station_sanado_hour_marginGC" TIMESTAMP(3),
    "gas_station_sanado_marginGC" BOOLEAN,
    "gas_station_margin_MLT" DOUBLE PRECISION,
    "gas_station_margin_TMP" DOUBLE PRECISION,
    "gas_station_LUCRO_BRUTO_GALONAGEM_modal" DOUBLE PRECISION,
    "gas_station_LUCRO_BRUTO_OPERACIONAL_modal" DOUBLE PRECISION,
    "gas_station_LUCRO_BRUTO_PRODUTO_modal" DOUBLE PRECISION,
    "gas_station_MLT_modal" DOUBLE PRECISION,
    "gas_station_TMC_modal" DOUBLE PRECISION,
    "gas_station_TMF_modal" DOUBLE PRECISION,
    "gas_station_TMP_modal" DOUBLE PRECISION,
    "gas_station_TMVOL_modal" DOUBLE PRECISION,
    "gas_station_ETANOL_COMUM_comb" DOUBLE PRECISION,
    "gas_station_GASOLINA_COMUM_comb" DOUBLE PRECISION,
    "gas_station_OLEO_DIESEL_B_S10_COMUM_comb" DOUBLE PRECISION,
    "gas_station_OLEO_DIESEL_B_S500_COMUM_comb" DOUBLE PRECISION,
    "gas_station_margin_DIESEL_GROUP" DOUBLE PRECISION,
    "gas_station_sanado_hour_margin_DIESEL_GROUP" TIMESTAMP(3),
    "gas_station_sanado_margin_DIESEL_GROUP" BOOLEAN,
    "gas_station_type_margin_DIESEL_GROUP" BOOLEAN,
    "verification_hour_margin_DIESEL_GROUP" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "gas_station_margin_GASOLINA_PODIUM" DOUBLE PRECISION,
    "gas_station_sanado_hour_margin_GASOLINA_PODIUM" TIMESTAMP(3),
    "gas_station_sanado_margin_GASOLINA_PODIUM" BOOLEAN,
    "gas_station_type_margin_GASOLINA_PODIUM" BOOLEAN,
    "verification_hour_margin_GASOLINA_PODIUM" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "gas_station_margin_GASOLINA_PREMIUM" DOUBLE PRECISION,
    "gas_station_sanado_hour_margin_GASOLINA_PREMIUM" TIMESTAMP(3),
    "gas_station_sanado_margin_GASOLINA_PREMIUM" BOOLEAN,
    "gas_station_type_margin_GASOLINA_PREMIUM" BOOLEAN,
    "verification_hour_margin_GASOLINA_PREMIUM" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "gas_station_margin_DIESEL_GROUP_S500" DOUBLE PRECISION,
    "gas_station_sanado_hour_margin_DIESEL_GROUP_S500" TIMESTAMP(3),
    "gas_station_sanado_margin_DIESEL_GROUP_S500" BOOLEAN,
    "gas_station_type_margin_DIESEL_GROUP_S500" BOOLEAN,
    "verification_hour_margin_DIESEL_GROUP_S500" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "gas_station_margin_ETANOL_COMUM" DOUBLE PRECISION,
    "gas_station_sanado_hour_ETANOL_COMUM" TIMESTAMP(3),
    "gas_station_sanado_margin_ETANOL_COMUM" BOOLEAN,
    "gas_station_type_margin_ETANOL_COMUM" BOOLEAN,
    "verification_hour_margin_ETANOL_COMUM" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "gas_station_invoice_comb" DOUBLE PRECISION,
    "gas_station_invoice_prod" DOUBLE PRECISION,
    "gas_station_invoice_comb_daily" DOUBLE PRECISION,
    "gas_station_invoice_prod_daily" DOUBLE PRECISION,
    "gas_station_margin_TOTAL_PRODUCT" DOUBLE PRECISION,
    "gas_station_sanado_hour_margin_TOTAL_PRODUCT" TIMESTAMP(3),
    "gas_station_sanado_margin_TOTAL_PRODUCT" BOOLEAN,
    "gas_station_type_margin_TOTAL_PRODUCT" BOOLEAN,
    "verification_hour_margin_TOTAL_PRODUCT" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "gas_station_margin_ADITIVOS_AUTOMOVEIS_PRODUCT" DOUBLE PRECISION,
    "gas_station_sanado_hour_margin_ADITIVOS_AUTOMOVEIS_PRODUCT" TIMESTAMP(3),
    "gas_station_sanado_margin_ADITIVOS_AUTOMOVEIS_PRODUCT" BOOLEAN,
    "gas_station_type_margin_ADITIVOS_AUTOMOVEIS_PRODUCT" BOOLEAN,
    "verification_hour_margin_ADITIVOS_AUTOMOVEIS_PRODUCT" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "gas_station_freight_value" DOUBLE PRECISION,
    "gas_station_gross_result_literage" DOUBLE PRECISION,
    "gas_station_gross_result_product" DOUBLE PRECISION,
    "gas_station_margin_FILTROS_AR_PRODUCT" DOUBLE PRECISION,
    "gas_station_sanado_hour_margin_FILTROS_AR_PRODUCT" TIMESTAMP(3),
    "gas_station_sanado_margin_FILTROS_AR_PRODUCT" BOOLEAN,
    "gas_station_type_margin_FILTROS_AR_PRODUCT" BOOLEAN,
    "verification_hour_margin_FILTROS_AR_PRODUCT" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "gas_station_setvariables_pkey" PRIMARY KEY ("gas_station_uuid")
);

-- CreateTable
CREATE TABLE "region_setvariables" (
    "region_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "region_marginGC" DOUBLE PRECISION,
    "region_type_marginGC" BOOLEAN,
    "region_whats_app" VARCHAR(255)[],
    "region_station_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "region_station_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "use_uuid" UUID,
    "regions_uuid" UUID,
    "verification_msg_sent" BOOLEAN DEFAULT false,
    "verification_hour_marginGC" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "region_sanado_hour_marginGC" TIMESTAMP(3),
    "region_sanado_marginGC" BOOLEAN,
    "region_station_ETANOL_COMUM_comb" DOUBLE PRECISION,
    "region_station_GASOLINA_COMUM_comb" DOUBLE PRECISION,
    "region_station_LUCRO_BRUTO_GALONAGEM_modal" DOUBLE PRECISION,
    "region_station_LUCRO_BRUTO_OPERACIONAL_modal" DOUBLE PRECISION,
    "region_station_LUCRO_BRUTO_PRODUTO_modal" DOUBLE PRECISION,
    "region_station_MLT_modal" DOUBLE PRECISION,
    "region_station_OLEO_DIESEL_B_S10_COMUM_comb" DOUBLE PRECISION,
    "region_station_OLEO_DIESEL_B_S500_COMUM_comb" DOUBLE PRECISION,
    "region_station_TMC_modal" DOUBLE PRECISION,
    "region_station_TMF_modal" DOUBLE PRECISION,
    "region_station_TMP_modal" DOUBLE PRECISION,
    "region_station_TMVOL_modal" DOUBLE PRECISION,
    "region_margin_DIESEL_GROUP" DOUBLE PRECISION,
    "region_sanado_hour_margin_DIESEL_GROUP" TIMESTAMP(3),
    "region_sanado_margin_DIESEL_GROUP" BOOLEAN,
    "region_type_margin_DIESEL_GROUP" BOOLEAN,
    "verification_hour_margin_DIESEL_GROUP" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "region_margin_GASOLINA_PODIUM" DOUBLE PRECISION,
    "region_sanado_hour_GASOLINA_PODIUM" TIMESTAMP(3),
    "region_sanado_margin_GASOLINA_PODIUM" BOOLEAN,
    "region_type_margin_GASOLINA_PODIUM" BOOLEAN,
    "verification_hour_margin_GASOLINA_PODIUM" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "region_margin_GASOLINA_PREMIUM" DOUBLE PRECISION,
    "region_sanado_hour_margin_GASOLINA_PREMIUM" TIMESTAMP(3),
    "region_sanado_margin_GASOLINA_PREMIUM" BOOLEAN,
    "region_type_margin_GASOLINA_PREMIUM" BOOLEAN,
    "verification_hour_margin_GASOLINA_PREMIUM" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "region_sanado_hour_GASOLINA_PREMIUM" TIMESTAMP(3),
    "region_margin_DIESEL_GROUP_S500" DOUBLE PRECISION,
    "region_sanado_hour_margin_DIESEL_GROUP_S500" TIMESTAMP(3),
    "region_sanado_margin_DIESEL_GROUP_S500" BOOLEAN,
    "region_type_margin_DIESEL_GROUP_S500" BOOLEAN,
    "verification_hour_margin_DIESEL_GROUP_S500" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,
    "region_margin_ETANOL_COMUM" DOUBLE PRECISION,
    "region_sanado_hour_ETANOL_COMUM" TIMESTAMP(3),
    "region_sanado_margin_ETANOL_COMUM" BOOLEAN,
    "region_type_margin_ETANOL_COMUM" BOOLEAN,
    "verification_hour_margin_ETANOL_COMUM" TIMESTAMP(3) DEFAULT '2023-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "region_setvariables_pkey" PRIMARY KEY ("region_uuid")
);

-- CreateTable
CREATE TABLE "regions" (
    "regions_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "regions_name" VARCHAR(50),
    "regions_types" VARCHAR(50),
    "region_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "region_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "regions_margin_GC" DOUBLE PRECISION[],
    "regions_margin_GASOLINA_PODIUM" DOUBLE PRECISION[],
    "regions_margin_GASOLINA_PREMIUM" DOUBLE PRECISION[],
    "regions_margin_DIESEL_GROUP" DOUBLE PRECISION[],
    "regions_margin_DIESEL_GROUP_S500" DOUBLE PRECISION[],
    "regions_margin_ETANOL_COMUM" DOUBLE PRECISION[],

    CONSTRAINT "regions_pkey" PRIMARY KEY ("regions_uuid")
);

-- CreateTable
CREATE TABLE "big_numbers_values" (
    "bignumbers_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bignumbers_sumliterage" DOUBLE PRECISION,
    "bignumbers_invoicing" DOUBLE PRECISION,
    "bignumbers_Supplies" DOUBLE PRECISION,
    "bignumbers_fuelSales" DOUBLE PRECISION,
    "bignumbers_fuelProfit" DOUBLE PRECISION,
    "bignumbers_productSales" DOUBLE PRECISION,
    "bignumbers_productProfit" DOUBLE PRECISION,
    "bignumbers_dailyProductProfit" DOUBLE PRECISION,
    "bignumbers_dailyLiterageProfit" DOUBLE PRECISION,

    CONSTRAINT "big_numbers_values_pkey" PRIMARY KEY ("bignumbers_uuid")
);

-- CreateTable
CREATE TABLE "gallon_gross_history" (
    "gallon_history_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ibm_info_id" UUID,
    "use_uuid" UUID,
    "gallon_history_gross" DOUBLE PRECISION,
    "gallon_history_date" TIMESTAMP(3),
    "gallon_history_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gallon_history_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallon_gross_history_pkey" PRIMARY KEY ("gallon_history_uuid")
);

-- CreateTable
CREATE TABLE "product_gross_history" (
    "product_history_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ibm_info_id" UUID,
    "use_uuid" UUID,
    "product_history_gross" DOUBLE PRECISION,
    "product_history_date" TIMESTAMP(3),
    "product_history_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_history_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_gross_history_pkey" PRIMARY KEY ("product_history_uuid")
);

-- AddForeignKey
ALTER TABLE "gas_station_setvariables" ADD CONSTRAINT "gas_station_setvariables_ibm_info_id_fkey" FOREIGN KEY ("ibm_info_id") REFERENCES "ibm_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_station_setvariables" ADD CONSTRAINT "gas_station_setvariables_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "region_setvariables" ADD CONSTRAINT "region_setvariables_regions_uuid_fkey" FOREIGN KEY ("regions_uuid") REFERENCES "regions"("regions_uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "region_setvariables" ADD CONSTRAINT "region_setvariables_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallon_gross_history" ADD CONSTRAINT "gallon_gross_history_ibm_info_id_fkey" FOREIGN KEY ("ibm_info_id") REFERENCES "ibm_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallon_gross_history" ADD CONSTRAINT "gallon_gross_history_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_gross_history" ADD CONSTRAINT "product_gross_history_ibm_info_id_fkey" FOREIGN KEY ("ibm_info_id") REFERENCES "ibm_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_gross_history" ADD CONSTRAINT "product_gross_history_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
