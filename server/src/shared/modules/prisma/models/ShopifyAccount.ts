import {
  ShopifyAccount,
  ShopifyAccountEvent,
  ShopifyAccountStatus,
  ShopifyAccountInstall,
  ShopifyAccountInstallFailedReason,
  ShopifyAccountInstallStatus,
} from '@prisma/client';
export type DbShopifyAccountInstallFailedReason =
  ShopifyAccountInstallFailedReason;
export type DbShopifyAccountInstallStatus = ShopifyAccountInstallStatus;
export type DbShopifyAccountInstall = ShopifyAccountInstall;
export type DbShopifyAccountEvent = ShopifyAccountEvent;
export type DbShopifyAccountStatus = ShopifyAccountStatus;
export type DbShopifyAccount = ShopifyAccount & {
  events?: DbShopifyAccountEvent[];
  installation?: DbShopifyAccountInstall;
};
