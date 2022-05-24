import {
  DbProduct,
  DbProductType,
  DbProductVariant,
} from "@catalog/database/entities";
import {
  IProductProps,
  Product,
  IPersonalizationRule,
  IProductTypeProps,
  ProductType,
  LivePreview,
  IVariantProps,
  Variant,
} from "@catalog/model";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule } from "@nestjs/testing";
import { mockUuid1 } from "@sales/mocks";
import { CreateProductDto, ProductsRepository } from "..";
import { ProductService } from "./ProductService";
import { now, spyOnDate } from "@shared/mocks";
import { getRepositoryToken } from "@mikro-orm/nestjs";
spyOnDate();
describe("ProductService", () => {
  let module: TestingModule;
  let service: ProductService;

  let prodTypeProps: IProductTypeProps;
  let prodType: ProductType;
  let dbProdType: DbProductType;

  let prodProps: IProductProps;
  let prod: Product;
  let dbProd: DbProduct;

  let vprops: IVariantProps;
  let variant: Variant;
  let dbVariant: DbProductVariant;

  const PROD_TYPE = `2DMetalArt`;
  const PSKU = `MEM-000-01`;
  const VSKU = `${PSKU}-12-Black`;

  beforeEach(async () => {
    module = await mockCatalogModule().compile();
    service = await module.resolve(ProductService);
    prodTypeProps = {
      id: mockUuid1,
      name: PROD_TYPE,
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
      id: mockUuid1,
      sku: PSKU,
      type: PROD_TYPE,
      productTypeId: mockUuid1,
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
      id: mockUuid1,
      image: "MOCK_IMG",
      sku: VSKU,
      type: PROD_TYPE,
      productId: mockUuid1,
      productTypeId: mockUuid1,

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
  describe("create", () => {
    let dto: CreateProductDto;
    beforeEach(() => {
      dto = new CreateProductDto();
      dto.sku = prodProps.sku;
      dto.image = "NEW_IMAGE";
      dto.type = prodProps.type;
      dto.pricingTier = prodProps.pricingTier;
      dto.svg = "NEW_SVG";
      dto.personalizationRules = [
        ...prodProps.personalizationRules,
        {
          label: "",
          maxLength: null,
          options: null,
          pattern: null,
          name: "",
          placeholder: "",
          required: false,
          type: "text",
        },
      ];
      dto.tags = "Tag1,Tag2";
    });
    it("should create new Product if not found", async () => {
      const createFn = jest.fn().mockResolvedValue(dbProd);
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(getRepositoryToken(DbProductType))
        .useValue({
          findOne: jest.fn().mockResolvedValue(dbProdType),
        })
        .overrideProvider(getRepositoryToken(DbProduct))
        .useValue({
          findOne: jest.fn().mockResolvedValue(null),
          create: createFn,
          persistAndFlush: jest.fn(),
        })
        .compile();
      const repo = await module.resolve(getRepositoryToken(DbProduct));
      const createSpy = jest.spyOn(repo, "create");

      service = await module.resolve(ProductService);
      // WHEN
      const result = await service.findAndUpdateOrCreate(dto);
      const raw = result.raw();
      // THEN
      expect(raw).toMatchObject(prodProps);
      expect(createSpy).toBeCalledWith(
        new DbProduct({
          sku: prodProps.sku,
          image: "NEW_IMAGE",
          type: prodProps.type,
          pricingTier: prodProps.pricingTier,
          svg: "NEW_SVG",
          personalizationRules: [
            {
              label: "Name",
              maxLength: 20,
              name: "name",
              pattern: "^[a-zA-Z0-9\\s.,'/&]*",
              placeholder: "Enter up to 20 characters",
              required: true,
              type: "input",
              options: "",
            },
            {
              label: "",
              maxLength: 0,
              name: "",
              options: "",
              pattern: "",
              placeholder: "",
              required: false,
              type: "text",
            },
          ],
          tags: ["Tag1", "Tag2"],
          createdAt: now,
          updatedAt: now,
          variants: [],
        } as any)
      );
    });
  });
  describe("query", () => {
    it("should call the right repo method", async () => {
      const queryFn = jest.fn().mockResolvedValue([]);
      module = await mockCatalogModule()
        .overrideProvider(ProductsRepository)
        .useValue({ query: queryFn })
        .compile();
      service = await module.resolve(ProductService);

      // WHEN
      await service.query();
      // THEN
      expect(queryFn).toBeCalled();
    });
  });
  describe("findById", () => {
    it("should call the right repo method", async () => {
      const findByIdFn = jest.fn().mockResolvedValue(dbProd);
      module = await mockCatalogModule()
        .overrideProvider(ProductsRepository)
        .useValue({ findById: findByIdFn })
        .compile();
      service = await module.resolve(ProductService);

      // WHEN
      await service.findById("test");
      // THEN
      expect(findByIdFn).toBeCalledWith("test");
    });
  });
  describe("findBySku", () => {
    it("should call the right repo method", async () => {
      const findBySkuFn = jest.fn().mockResolvedValue(dbProd);
      module = await mockCatalogModule()
        .overrideProvider(ProductsRepository)
        .useValue({ findBySku: findBySkuFn })
        .compile();
      service = await module.resolve(ProductService);

      // WHEN
      await service.findBySku("test");
      // THEN
      expect(findBySkuFn).toBeCalledWith("test");
    });
  });
  describe("delete", () => {
    it("should call the right repo method", async () => {
      const deleteFn = jest.fn().mockResolvedValue([]);
      module = await mockCatalogModule()
        .overrideProvider(ProductsRepository)
        .useValue({ delete: deleteFn })
        .compile();
      service = await module.resolve(ProductService);

      // WHEN
      await service.delete("test");
      // THEN
      expect(deleteFn).toBeCalledWith("test");
    });
  });
  describe("import", () => {
    it("should import entries in a valid CSV file", async () => {
      const saveFn = jest.fn().mockReturnValue(dbProd);
      module = await mockCatalogModule()
        .overrideProvider(ProductsRepository)
        .useValue({ save: saveFn })
        .compile();
      service = await module.resolve(ProductService);
      const csvString =
        "Id,Sku,Code,PriceTier,Type,Svg,Image,Tags,Option1Name,Option2Name,Option3Name,CustomOption1,CustomOption2,CustomOption3,CustomOption4,CustomOption5,CustomOption6\n" +
        ',MU-C001-00,C001,1,APITestProductType,https://prodmyeasymonogram.s3.us-east-2.amazonaws.com/preview_images/2133323496/7329271441/MU-C001-00.svg,https://s3.console.aws.amazon.com/s3/buckets/prodmyeasymonogram?region=us-east-2&prefix=Product/Product+Variant+Images+-+Background+1/MU-C001-00-Black.png,"Steel, Custom, Initial",Size,Color,,"{""label"": ""Name"",""placeholder"": ""Enter up to 16 characters"",""required"": true,""type"": ""input"",""font"": ""Arbutus Slab"",""maxLength"": 16,""pattern"": ""A-Z,a-z,0-9""}","{""label"": ""Initial"",""placeholder"": ""Select Initial"",""required"": true,""type"": ""Dropdown"",""options"": ""A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z""}",,,,';
      const results = await service.import(csvString);
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
