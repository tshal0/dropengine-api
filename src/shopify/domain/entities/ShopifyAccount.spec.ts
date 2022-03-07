import moment from "moment";
import { UUID } from "@shared/domain/valueObjects";
import { ShopifyAccount } from "./ShopifyAccount";
import { ConnectShopifyAccountDto } from "../../dto/ConnectShopifyAccountDto";
import { ShopifyAccountStatus } from "./ShopifyAccountStatus";
import {
  ShopifyAccountInstallFailedReason,
  ShopifyAccountInstallStatus,
} from "./ShopifyAccountInstallStatus";
import { ShopifyAccountCreated } from "../events/ShopifyAccountEvent";

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());

describe(`ShopifyAccount`, () => {
  describe(`beginConnectionProcess`, () => {
    it(`should generate a valid account and installation`, async () => {
      const mockTimestamp = moment().toDate();
      const mockNonce = 1609459200000;
      const mockOrigin = `mock-origin.myshopify.com`;
      const mockHmac = "da9d83c171400a41f8db91a950508985";
      const mockUserId = UUID.generate();
      const mockUuid = UUID.generate();

      const na = "NOT_AVAILABLE";
      const mockUuidGenerate = jest.fn().mockReturnValue(mockUuid);
      UUID.generate = mockUuidGenerate;
      let mockDto: ConnectShopifyAccountDto = {
        hmac: mockHmac,
        shop: mockOrigin,
        timestamp: mockTimestamp.valueOf(),
        userId: mockUserId.value(),
      };
      let ev = ShopifyAccountCreated.generate(mockDto);
      let account = ShopifyAccount.create();
      let spy = jest.spyOn<ShopifyAccount, any>(
        account,
        "beginConnectionProcess"
      );
      account = account.beginConnectionProcess(ev);
      expect(spy).toBeCalled();

      let props = account._props();

      const expectedScopes =
        "read_orders,read_price_rules,read_products,read_order_edits";

      const expected = {
        id: mockUuid.value(),
        userId: mockUserId.value(),
        shopOrigin: mockOrigin,
        accessToken: na,
        scopes: expectedScopes,
        status: ShopifyAccountStatus.PENDING_INSTALL,
        installation: {
          accessToken: na,
          accessTokenLink: na,
          createdAt: mockTimestamp,
          failedReason: ShopifyAccountInstallFailedReason.NONE,
          hmac: mockHmac,
          id: mockUuid.value(),
          installLink: na,
          nonce: mockNonce,
          scopes: expectedScopes,
          shop: mockOrigin,
          shopifyAccountId: mockUuid.value(),
          status: ShopifyAccountInstallStatus.PENDING,
          timestamp: mockTimestamp.valueOf(),
          updatedAt: mockTimestamp,
        },
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
        events: [
          {
            aggregateId: mockUuid.value(),
            aggregateType: "ShopifyAccount",
            details: {
              hmac: mockHmac,
              shop: mockOrigin,
              timestamp: mockTimestamp.valueOf(),
              userId: mockUserId.value(),
            },
            eventType: "ShopifyAccount.Created",
            timestamp: mockTimestamp,
          },
          {
            aggregateId: mockUuid.value(),
            aggregateType: "ShopifyAccount",
            details: {
              hmac: mockHmac,
              scopes:
                "read_orders,read_price_rules,read_products,read_order_edits",
              shop: mockOrigin,
              shopifyAccountId: mockUuid.value(),
              timestamp: mockTimestamp.valueOf(),
              userId: mockUserId.value(),
            },
            eventType: "ShopifyAccount.InstallInitiated",
            timestamp: mockTimestamp,
          },
        ],
      };

      expect(props).toMatchObject(expected);
    });

    it(`should generate a valid install link`, () => {
      const expectedScopes =
        "read_orders,read_price_rules,read_products,read_order_edits";
      const ts = moment().toDate();
      const mockOrigin = "mock-origin.myshopify.com";
      const mockHmac = "da9d83c171400a41f8db91a950508985";
      const mockUserId = UUID.generate();
      const mockUuid = UUID.generate();
      const na = "NOT_AVAILABLE";
      const mockUuidGenerate = jest.fn().mockReturnValue(mockUuid);
      UUID.generate = mockUuidGenerate;
      let mockDto: ConnectShopifyAccountDto = {
        hmac: mockHmac,
        shop: mockOrigin,
        timestamp: ts.valueOf(),
        userId: mockUserId.value(),
      };
      let ev = ShopifyAccountCreated.generate(mockDto);

      let account = ShopifyAccount.create();
      account.beginConnectionProcess(ev);
      const mockApiKey = `MOCK_API_KEY`;
      const mockBaseUrl = `https://localhost:3000`;
      account.generateInstallLink(mockApiKey, mockBaseUrl);
      const installLink = account.getInstallLink();
      expect(installLink).toBe(
        `https://mock-origin.myshopify.com/admin/oauth/authorize?client_id=MOCK_API_KEY&scope=read_orders,read_price_rules,read_products,read_order_edits&state=1609459200000&redirect_uri=https://localhost:3000/shopify/install`
      );
    });
  });
  describe(`acceptInstallation`, () => {
    it(`should update installation status to ACCEPTED`, async () => {
      const ts = moment().toDate();
      const mockOrigin = "mock-origin.myshopify.com";
      const mockHmac = "da9d83c171400a41f8db91a950508985";
      const mockUserId = UUID.generate();
      const mockUuid = UUID.generate();
      const na = "NOT_AVAILABLE";
      const mockUuidGenerate = jest.fn().mockReturnValue(mockUuid);
      const mockApiKey = `MOCK_API_KEY`;
      const mockBaseUrl = `https://localhost:3000`;

      UUID.generate = mockUuidGenerate;

      let mockDto: ConnectShopifyAccountDto = {
        hmac: mockHmac,
        shop: mockOrigin,
        timestamp: ts.valueOf(),
        userId: mockUserId.value(),
      };

      let ev = ShopifyAccountCreated.generate(mockDto);

      let account = ShopifyAccount.create();

      account.beginConnectionProcess(ev);
      account.generateInstallLink(mockApiKey, mockBaseUrl);
      account.acceptShopifyInstall({
        code: "1282f67b9bc4c651c3e6331a47aa1526",
        hmac: "141c3668c228aa13f30ab51eec91de35c65d8aebc2423ae31222dd64e32629d1",
        host: "ZGUtdGVtcGxhdGUtbG9jYWwubXlzaG9waWZ5LmNvbS9hZG1pbg",
        shop: "mock-origin.myshopify.com",
        state: ts.valueOf(),
        timestamp: ts,
        url: `/shopify/install?code=1282f67b9bc4c651c3e6331a47aa1526&hmac=141c3668c228aa13f30ab51eec91de35c65d8aebc2423ae31222dd64e32629d1&host=ZGUtdGVtcGxhdGUtbG9jYWwubXlzaG9waWZ5LmNvbS9hZG1pbg&shop=mock-origin.myshopify.com&state=1642525557&timestamp=1642525568`,
        installId: account._props()?.installation?.id,
      });
    });
  });
  describe(`confirmInstallation`, () => {
    it(`should update the existing installation with an access token`, async () => {});
  });
  describe(`failInstallation`, () => {
    it(`should update installation status to FAILED`, async () => {});
  });
  describe(`resetInstallation`, () => {
    it(`should update installation status to INITIATED`, async () => {});
  });
});
