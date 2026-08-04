-- CreateTable
CREATE TABLE "gallon_gross_last_week" (
    "gallon_last_history_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "use_uuid" UUID,
    "gallon_last_history_gross" DOUBLE PRECISION,
    "gallon_last_history_date" TIMESTAMP(3),
    "gallon_last_history_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gallon_last_history_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallon_gross_last_week_pkey" PRIMARY KEY ("gallon_last_history_uuid")
);

-- CreateTable
CREATE TABLE "product_gross_last_week" (
    "product_last_history_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "use_uuid" UUID,
    "product_last_history_gross" DOUBLE PRECISION,
    "product_last_history_date" TIMESTAMP(3),
    "product_last_history_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_last_history_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_gross_last_week_pkey" PRIMARY KEY ("product_last_history_uuid")
);

-- CreateTable
CREATE TABLE "mlt_history" (
    "mlt_history_uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "use_uuid" UUID,
    "mlt_history_value" DOUBLE PRECISION,
    "mlt_history_date" TIMESTAMP(3),
    "mlt_history_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mlt_history_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mlt_history_pkey" PRIMARY KEY ("mlt_history_uuid")
);

-- AddForeignKey
ALTER TABLE "gallon_gross_last_week" ADD CONSTRAINT "gallon_gross_last_week_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_gross_last_week" ADD CONSTRAINT "product_gross_last_week_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mlt_history" ADD CONSTRAINT "mlt_history_use_uuid_fkey" FOREIGN KEY ("use_uuid") REFERENCES "users"("use_uuid") ON DELETE SET NULL ON UPDATE CASCADE;
