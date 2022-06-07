import {
  DbProduct,
  DbProductType,
  DbProductVariant,
} from "@catalog/database/entities";
import {
  IPersonalizationRule,
  IProductProps,
  IProductTypeProps,
  IVariantProps,
  LivePreview,
  Product,
  ProductType,
  ProductTypes,
  ProductTypeSlugs,
  Variant,
} from "@catalog/model";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule } from "@nestjs/testing";
import { now } from "@shared/mocks";
import {
  CreateVariantDto,
  CreateVariantDtoDimension,
  CreateVariantDtoMoney,
  CreateVariantDtoOption,
  CreateVariantDtoWeight,
  ProductsRepository,
  ProductTypesRepository,
  VariantsRepository,
} from "..";
import { VariantService } from "./VariantService";

describe("VariantService", () => {
  let module: TestingModule;
  let service: VariantService;

  let prodTypeProps: IProductTypeProps;
  let prodType: ProductType;
  let dbProdType: DbProductType;

  let prodProps: IProductProps;
  let prod: Product;
  let dbProd: DbProduct;

  let vprops: IVariantProps;
  let variant: Variant;
  let dbVariant: DbProductVariant;

  const PROD_TYPE = ProductTypes.MetalArt;
  const PROD_TYPE_SLUG = ProductTypeSlugs.MetalArt;
  const PSKU = `MEM-000-01`;
  const VSKU = `${PSKU}-12-Black`;

  beforeEach(async () => {
    module = await mockCatalogModule().compile();
    service = await module.resolve(VariantService);

    prodTypeProps = {
      id: 1,
      name: PROD_TYPE,
      slug: PROD_TYPE_SLUG,
      image: "MOCK_IMG",
      productionData: { material: "Mild Steel", route: "1", thickness: "0.06" },
      option1: {
        enabled: true,
        name: "Size",
        values: [
          { enabled: true, value: '12"' },
          { enabled: true, value: '15"' },
          { enabled: true, value: '18"' },
        ],
      },
      option2: {
        enabled: true,
        name: "Color",
        values: [
          { enabled: true, value: "Black" },
          { enabled: true, value: "Gold" },
          { enabled: true, value: "Copper" },
        ],
      },
      option3: {
        enabled: false,
        name: "",
        values: [],
      },
      livePreview: new LivePreview().raw(),
      products: [],
      updatedAt: now,
      createdAt: now,
    };
    prodType = new ProductType(prodTypeProps);
    dbProdType = new DbProductType(prodTypeProps);
    const mockNameRule: IPersonalizationRule = {
      name: "name",
      type: "input",
      label: "Name",
      options: "",
      pattern: "^[a-zA-Z0-9\\s.,'/&]*",
      required: true,
      maxLength: 20,
      placeholder: "Enter up to 20 characters",
    };
    prodProps = {
      id: 1,
      sku: PSKU,
      type: PROD_TYPE,
      pricingTier: "2",
      tags: ["MOCK_TAG"],
      image: "MOCK_IMG",
      svg: "MOCK_SVG",
      personalizationRules: [mockNameRule],
      variants: [],
      productType: prodTypeProps,
      updatedAt: now,
      createdAt: now,
    };

    prod = new Product(prodProps);
    dbProd = new DbProduct(prodProps);
    vprops = {
      id: 1,
      image: "MOCK_IMG",
      sku: VSKU,
      type: PROD_TYPE,

      option1: { name: "Size", value: '12"' },
      option2: { name: "Color", value: "Black" },
      option3: { name: "", value: undefined },
      height: { dimension: 100, units: "mm" },
      width: { dimension: 100, units: "mm" },
      weight: { dimension: 100, units: "g" },
      manufacturingCost: { total: 100, currency: "USD" },
      shippingCost: { total: 100, currency: "USD" },
      product: prodProps,
      productType: prodTypeProps,
    };
    variant = new Variant(vprops);
    dbVariant = new DbProductVariant(vprops);
  });
  describe("swapVariantOptions", () => {
    it("should swap Variant options that dont match the ProductType options", () => {
      // GIVEN

      // Variant options are swapped
      const option1 = new CreateVariantDtoOption();
      option1.name = "Color";
      option1.value = "Black";
      const option2 = new CreateVariantDtoOption();
      option2.name = "Size";
      option2.value = '12"';
      const option3 = new CreateVariantDtoOption();

      let dto: CreateVariantDto = {
        sku: "",
        type: "",
        image: "",
        height: new CreateVariantDtoDimension(),
        width: new CreateVariantDtoDimension(),
        weight: new CreateVariantDtoWeight(),
        option1: option1,
        option2: option2,
        option3: option3,
      };

      // WHEN
      let result = service.swapVariantOptions(prodType, dto);
      // THEN
      expect(result).toEqual({
        height: {},
        image: "",
        option1: {
          name: "Size",
          value: '12"',
        },
        option2: {
          name: "Color",
          value: "Black",
        },
        option3: {
          name: "",
          value: undefined,
        },
        sku: "",
        type: "",
        weight: {},
        width: {},
      });
    });
    it("given null VariantOption Names, should find the ProductTypeOption they fit in and swap", () => {
      // GIVEN

      // Variant options are swapped
      const option1 = new CreateVariantDtoOption();
      option1.name = undefined;
      option1.value = "Black";
      const option2 = new CreateVariantDtoOption();
      option2.name = null;
      option2.value = '12"';
      const option3 = new CreateVariantDtoOption();

      let dto: CreateVariantDto = {
        sku: "",
        type: "",
        image: "",
        height: new CreateVariantDtoDimension(),
        width: new CreateVariantDtoDimension(),
        weight: new CreateVariantDtoWeight(),
        option1: option1,
        option2: option2,
        option3: option3,
      };

      // WHEN
      let result = service.swapVariantOptions(prodType, dto);
      // THEN
      expect(result).toEqual({
        height: {},
        image: "",
        option1: {
          name: "Size",
          value: '12"',
        },
        option2: {
          name: "Color",
          value: "Black",
        },
        option3: {
          name: "",
          value: undefined,
        },
        sku: "",
        type: "",
        weight: {},
        width: {},
      });
    });
  });
  describe("findAndUpdateOrCreate", () => {
    let dto: CreateVariantDto;
    beforeEach(async () => {
      dto = new CreateVariantDto();
      dto.id = undefined;
      dto.sku = VSKU;
      dto.type = PROD_TYPE;
      dto.image = "MOCK_IMG";
      dto.productSku = PSKU;
      dto.option1 = new CreateVariantDtoOption();
      dto.option1.name = "Size";
      dto.option1.value = '12"';
      dto.option2 = new CreateVariantDtoOption();
      dto.option2.name = "Color";
      dto.option2.value = "Black";
      dto.option3 = new CreateVariantDtoOption();
      dto.height = new CreateVariantDtoDimension();
      dto.height.dimension = 100;
      dto.height.units = "mm";
      dto.width = new CreateVariantDtoDimension();
      dto.width.dimension = 100;
      dto.width.units = "mm";
      dto.weight = new CreateVariantDtoWeight();
      dto.weight.dimension = 100;
      dto.weight.units = "g";
      dto.manufacturingCost = new CreateVariantDtoMoney();
      dto.manufacturingCost.total = 100;
      dto.manufacturingCost.currency = "USD";
      dto.shippingCost = new CreateVariantDtoMoney();
      dto.shippingCost.total = 100;
      dto.shippingCost.currency = "USD";
    });
    it("should create if not exists", async () => {
      const lookupProductFn = jest.fn().mockResolvedValue(prod);
      const lookupTypeFn = jest.fn().mockResolvedValue(prodType);
      module = await mockCatalogModule()
        .overrideProvider(ProductsRepository)
        .useValue({
          lookupBySkuOrId: lookupProductFn,
        })
        .overrideProvider(ProductTypesRepository)
        .useValue({
          lookupByNameOrId: lookupTypeFn,
        })
        .overrideProvider(VariantsRepository)
        .useValue({
          save: jest.fn().mockImplementation((e: Variant) => {
            e.id = 1;
            return e;
          }),
        })
        .compile();
      service = await module.resolve(VariantService);
      // WHEN
      let result = await service.findAndUpdateOrCreate(dto);
      // THEN
      expect(result.raw()).toMatchObject({
        id: 1,
        sku: VSKU,
        type: PROD_TYPE,
        height: {
          dimension: 100,
          units: "mm",
        },
        image: "MOCK_IMG",
        manufacturingCost: {
          currency: "USD",
          total: 100,
        },
        option1: {
          name: "Size",
          value: '12"',
        },
        option2: {
          name: "Color",
          value: "Black",
        },
        option3: {
          name: "",
          value: undefined,
        },
        shippingCost: {
          currency: "USD",
          total: 100,
        },

        weight: {
          dimension: 100,
          units: "g",
        },
        width: {
          dimension: 100,
          units: "mm",
        },
      });
    });
  });
  describe("query", () => {
    it("should call the right repo method", async () => {
      const queryFn = jest.fn().mockResolvedValue([]);
      module = await mockCatalogModule()
        .overrideProvider(VariantsRepository)
        .useValue({ query: queryFn })
        .compile();
      service = await module.resolve(VariantService);

      // WHEN
      await service.query();
      // THEN
      expect(queryFn).toBeCalled();
    });
  });
  describe("findById", () => {
    it("should call the right repo method", async () => {
      const mockFn = jest.fn().mockResolvedValue(dbVariant);
      module = await mockCatalogModule()
        .overrideProvider(VariantsRepository)
        .useValue({ findById: mockFn })
        .compile();
      service = await module.resolve(VariantService);

      // WHEN
      await service.findById(1);
      // THEN
      expect(mockFn).toBeCalledWith(1);
    });
  });
  describe("findBySku", () => {
    it("should call the right repo method", async () => {
      const mockFn = jest.fn().mockResolvedValue(dbVariant);
      module = await mockCatalogModule()
        .overrideProvider(VariantsRepository)
        .useValue({ findBySku: mockFn })
        .compile();
      service = await module.resolve(VariantService);

      // WHEN
      await service.findBySku("test");
      // THEN
      expect(mockFn).toBeCalledWith("test");
    });
  });
  describe("delete", () => {
    it("should call the right repo method", async () => {
      const mockFn = jest.fn().mockResolvedValue([]);
      module = await mockCatalogModule()
        .overrideProvider(VariantsRepository)
        .useValue({ delete: mockFn })
        .compile();
      service = await module.resolve(VariantService);

      // WHEN
      await service.delete(1);
      // THEN
      expect(mockFn).toBeCalledWith(1);
    });
  });
  describe("import", () => {
    it("should import entries in a valid CSV file", async () => {
      const lookupProductFn = jest.fn().mockResolvedValue(prod);
      const lookupTypeFn = jest.fn().mockResolvedValue(prodType);
      module = await mockCatalogModule()
        .overrideProvider(ProductsRepository)
        .useValue({
          lookupBySkuOrId: lookupProductFn,
        })
        .overrideProvider(ProductTypesRepository)
        .useValue({
          lookupByNameOrId: lookupTypeFn,
        })
        .overrideProvider(VariantsRepository)
        .useValue({
          save: jest.fn().mockImplementation((e: Variant) => {
            e.id = 1;
            const dbv = new DbProductVariant(e.raw());
            dbv.product = dbProd;
            dbv.productType = dbProdType;
            return dbv;
          }),
        })
        .compile();
      service = await module.resolve(VariantService);
      const url = `https://s3.console.aws.amazon.com/s3/buckets/prodmyeasymonogram?region=us-east-2&prefix=Product/Product+Variant+Images+-+Background+1/MU-C001-00-12-Copper`;
      const csvString =
        `ProductId,ProductSku,` +
        `VariantId,VariantSku,` +
        `Option1Value,Option2Value,Option3Value,` +
        `VariantImage,DimensionUnits,HeightValue,WidthValue,` +
        `WeightUnits,WeightValue,` +
        `Currency,ManufacturingCost,ShippingCost,TotalCost\n` +
        `,${PSKU},` +
        `,${VSKU},` +
        `12",Black,,` +
        `${url},in,11.5,11.5,` +
        `g,365,` +
        `USD,16,7.5,23.5`;
      const results = await service.import(csvString);
      expect(results.length).toBeGreaterThan(0);
      expect(results.map((r) => r.raw())).toMatchObject([
        {
          id: 1,
          sku: VSKU,
          type: PROD_TYPE,
          option1: {
            name: "Size",
            value: '12"',
          },
          option2: {
            name: "Color",
            value: "Black",
          },
          option3: {
            name: "",
            value: "",
          },
          image: url,
          height: {
            dimension: 11.5,
            units: "in",
          },
          manufacturingCost: {
            currency: "USD",
            total: 1600,
          },
          shippingCost: {
            currency: "USD",
            total: 750,
          },
          weight: {
            dimension: 365,
            units: "g",
          },
          width: {
            dimension: 11.5,
            units: "in",
          },
        },
      ]);
    });
  });
});
