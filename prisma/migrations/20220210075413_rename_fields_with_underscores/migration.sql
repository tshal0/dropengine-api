/*
  Warnings:

  - You are about to drop the column `accessToken` on the `shopify_account_installs` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenLink` on the `shopify_account_installs` table. All the data in the column will be lost.
  - You are about to drop the column `authorizationCode` on the `shopify_account_installs` table. All the data in the column will be lost.
  - You are about to drop the column `failedReason` on the `shopify_account_installs` table. All the data in the column will be lost.
  - You are about to drop the column `installLink` on the `shopify_account_installs` table. All the data in the column will be lost.
  - You are about to drop the column `shopifyAccountId` on the `shopify_account_installs` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `shopify_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `shopOrigin` on the `shopify_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `shopify_accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopify_account_id]` on the table `shopify_account_installs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shop_origin]` on the table `shopify_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `shopify_account_installs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_token_link` to the `shopify_account_installs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorization_code` to the `shopify_account_installs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `install_link` to the `shopify_account_installs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopify_account_id` to the `shopify_account_installs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `access_token` to the `shopify_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_origin` to the `shopify_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "shopify_account_installs" DROP CONSTRAINT "shopify_account_installs_shopifyAccountId_fkey";

-- DropIndex
DROP INDEX "shopify_account_installs_shopifyAccountId_key";

-- DropIndex
DROP INDEX "shopify_accounts_shopOrigin_key";

-- AlterTable
ALTER TABLE "shopify_account_installs" DROP COLUMN "accessToken",
DROP COLUMN "accessTokenLink",
DROP COLUMN "authorizationCode",
DROP COLUMN "failedReason",
DROP COLUMN "installLink",
DROP COLUMN "shopifyAccountId",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "access_token_link" TEXT NOT NULL,
ADD COLUMN     "authorization_code" TEXT NOT NULL,
ADD COLUMN     "failed_reason" "ShopifyAccountInstallFailedReason" NOT NULL DEFAULT E'NONE',
ADD COLUMN     "install_link" TEXT NOT NULL,
ADD COLUMN     "shopify_account_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shopify_accounts" DROP COLUMN "accessToken",
DROP COLUMN "shopOrigin",
DROP COLUMN "userId",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "shop_origin" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "shopify_account_installs_shopify_account_id_key" ON "shopify_account_installs"("shopify_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopify_accounts_shop_origin_key" ON "shopify_accounts"("shop_origin");

-- AddForeignKey
ALTER TABLE "shopify_account_installs" ADD CONSTRAINT "shopify_account_installs_shopify_account_id_fkey" FOREIGN KEY ("shopify_account_id") REFERENCES "shopify_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
