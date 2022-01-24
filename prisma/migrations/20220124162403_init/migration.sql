-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVATED', 'DEACTIVATED', 'DISABLED');

-- CreateEnum
CREATE TYPE "ShopifyAccountInstallStatus" AS ENUM ('PENDING', 'PENDING_SHOPIFY_ACCEPT', 'ACCEPTED', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "ShopifyAccountInstallFailedReason" AS ENUM ('NONE', 'INSTALL_LINK_EXPIRED', 'SHOP_ORIGIN_INVALID', 'HMAC_INVALID', 'TIMESTAMP_INVALID', 'NONCE_INVALID', 'USER_INVALID', 'SCOPES_INVALID', 'SCOPES_MISSING');

-- CreateEnum
CREATE TYPE "ShopifyAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DISABLED', 'PENDING', 'PENDING_INSTALL');

-- CreateTable
CREATE TABLE "user_events" (
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "aggregate_id" TEXT,
    "aggregate_type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT NOT NULL,

    CONSTRAINT "user_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "external_user_id" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT E'DEACTIVATED',
    "first_name" TEXT,
    "last_name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopify_account_installs" (
    "id" TEXT NOT NULL,
    "shopifyAccountId" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "hmac" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "scopes" TEXT NOT NULL,
    "authorizationCode" TEXT NOT NULL,
    "installLink" TEXT NOT NULL,
    "accessTokenLink" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "status" "ShopifyAccountInstallStatus" NOT NULL DEFAULT E'PENDING',
    "failedReason" "ShopifyAccountInstallFailedReason" NOT NULL DEFAULT E'NONE',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "shopify_account_installs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopify_account_events" (
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "aggregate_id" TEXT,
    "aggregate_type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT NOT NULL,

    CONSTRAINT "shopify_account_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "shopify_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "shopOrigin" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "status" "ShopifyAccountStatus" NOT NULL DEFAULT E'PENDING_INSTALL',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "shopify_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "shopify_account_installs_shopifyAccountId_key" ON "shopify_account_installs"("shopifyAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "shopify_accounts_shopOrigin_key" ON "shopify_accounts"("shopOrigin");

-- AddForeignKey
ALTER TABLE "user_events" ADD CONSTRAINT "user_events_aggregate_id_fkey" FOREIGN KEY ("aggregate_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopify_account_installs" ADD CONSTRAINT "shopify_account_installs_shopifyAccountId_fkey" FOREIGN KEY ("shopifyAccountId") REFERENCES "shopify_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopify_account_events" ADD CONSTRAINT "shopify_account_events_aggregate_id_fkey" FOREIGN KEY ("aggregate_id") REFERENCES "shopify_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
