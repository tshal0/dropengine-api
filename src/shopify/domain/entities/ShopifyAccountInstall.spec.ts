import moment from "moment";
import { UUID } from "@shared/domain/valueObjects";
import {
  ShopifyAccountInstallFailedReason,
  ShopifyAccountInstallStatus,
} from "./ShopifyAccountInstallStatus";
import {
  IShopifyAccountInstall,
  ShopifyAccountInstall,
} from "./ShopifyAccountInstall";
import { InstallShopifyAccountDto } from "../../dto/InstallShopifyAccountDto";

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());

describe(`ShopifyAccountInstall`, () => {
  it(`should generate a valid install`, async () => {
    const ts = moment().toDate();
    const mockNonce = ts.valueOf();

    const mockOrigin = "mock-origin";
    const mockHmac = "da9d83c171400a41f8db91a950508985";
    const mockShopifyAccountId = UUID.generate();
    const mockUuid = UUID.generate();
    const na = "NOT_AVAILABLE";
    const mockUuidGenerate = jest.fn().mockReturnValue(mockUuid);
    UUID.generate = mockUuidGenerate;
    const defaultScopes =
      "read_orders,read_price_rules,read_products,read_order_edits";
    let mockDto: InstallShopifyAccountDto = {
      hmac: mockHmac,
      shop: mockOrigin,
      timestamp: ts.valueOf(),
      scopes: defaultScopes,
      shopifyAccountId: mockShopifyAccountId.value(),
    };

    let install = ShopifyAccountInstall.create();
    let spy = jest.spyOn(install, "generateNonce");
    install = install.init(mockDto);
    expect(spy).toBeCalled();

    let props = install.props();

    const expected = {
      id: mockUuid.value(),
      shopifyAccountId: mockShopifyAccountId.value(),
      shop: mockOrigin,
      timestamp: ts.valueOf(),
      hmac: mockHmac,
      nonce: mockNonce,
      scopes: defaultScopes,
      installLink: na,
      accessTokenLink: na,
      accessToken: na,
      status: ShopifyAccountInstallStatus.PENDING,
      failedReason: ShopifyAccountInstallFailedReason.NONE,
      createdAt: ts,
      updatedAt: ts,
    };

    expect(props).toMatchObject(expected);
  });

  it(`should generate a valid install link`, () => {
    const ts = moment().toDate().valueOf();
    const nonce = ts.valueOf();

    const mockOrigin = "mock-origin";
    const mockHmac = "da9d83c171400a41f8db91a950508985";
    const mockShopifyAccountId = UUID.generate();
    const mockUuid = UUID.generate();
    const na = "NOT_AVAILABLE";
    const mockUuidGenerate = jest.fn().mockReturnValue(mockUuid);
    UUID.generate = mockUuidGenerate;
    const defaultScopes =
      "read_orders,read_price_rules,read_products,read_order_edits";
    let mockDto: InstallShopifyAccountDto = {
      hmac: mockHmac,
      shop: mockOrigin,
      timestamp: ts,
      scopes: defaultScopes,
      shopifyAccountId: mockShopifyAccountId.value(),
    };

    let install = ShopifyAccountInstall.create();
    let spy = jest.spyOn(install, "generateNonce");
    install = install.init(mockDto);
    expect(spy).toBeCalled();

    const mockApiKey = `MOCK_API_KEY`;
    const mockBaseUrl = `https://localhost:3000`;
    install.generateInstallLink(mockApiKey, mockBaseUrl);
    const installLink = install.installLink;
    expect(installLink).toBe(
      `https://${mockOrigin}/admin/oauth/authorize?client_id=${mockApiKey}&scope=${defaultScopes}&state=${nonce}&redirect_uri=${mockBaseUrl}/shopify/install`
    );
  });
});
