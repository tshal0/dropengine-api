/*
  Warnings:

  - You are about to drop the column `customization_options` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - The `tags` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `categories` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "customization_options",
DROP COLUMN "name",
ADD COLUMN     "custom_options" JSONB[],
DROP COLUMN "tags",
ADD COLUMN     "tags" TEXT[],
DROP COLUMN "categories",
ADD COLUMN     "categories" TEXT[],
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "svg" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
