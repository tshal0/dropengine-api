-- CreateTable
CREATE TABLE "events" (
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "aggregate_id" TEXT,
    "aggregate_type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" JSONB NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "uuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturing_details" JSONB NOT NULL,
    "option_1" JSONB,
    "option_2" JSONB,
    "option_3" JSONB,
    "live_preview" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "products" (
    "uuid" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "product_type_id" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "categories" JSONB NOT NULL,
    "image" TEXT NOT NULL,
    "svg" TEXT NOT NULL,
    "customization_options" JSONB[],
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_types_id_key" ON "product_types"("id");

-- CreateIndex
CREATE UNIQUE INDEX "products_id_key" ON "products"("id");
