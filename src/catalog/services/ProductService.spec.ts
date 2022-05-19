import { DbProduct } from "@catalog/database/entities";
import { IProductProps, Product, IPersonalizationRule } from "@catalog/domain";
import { mockCatalogModule } from "@catalog/mocks/catalog.module.mock";
import { TestingModule } from "@nestjs/testing";
import { mockUuid1 } from "@sales/mocks";
import { read } from "fs";
import { Readable } from "stream";
import { CreateProductDto, CsvProductDto, ProductsRepository } from "..";
import { ProductService } from "./ProductService";
import csv from "csvtojson";
import { lastValueFrom } from "rxjs";
import { setFlagsFromString } from "v8";

describe("ProductService", () => {
  let module: TestingModule;
  let service: ProductService;
  let prodProps: IProductProps;

  let prod: Product;
  let dbProd: DbProduct;
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
    sku: "MEM-001-01",
    type: "MockProductType",
    productTypeId: undefined,
    pricingTier: "2",
    tags: ["MOCK_TAG"],
    image: "MOCK_IMG",
    svg: "MOCK_SVG",
    personalizationRules: [mockNameRule],
    variants: [],
    updatedAt: new Date("2021-01-01T00:00:00.000Z"),
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
  };

  prod = new Product(prodProps);
  dbProd = new DbProduct();
  dbProd.id = mockUuid1;
  dbProd.sku = prodProps.sku;
  dbProd.image = prodProps.image;
  dbProd.type = prodProps.type;
  dbProd.pricingTier = prodProps.pricingTier;
  dbProd.svg = prodProps.svg;
  dbProd.personalizationRules = prodProps.personalizationRules;
  dbProd.tags = prodProps.tags;
  dbProd.createdAt = prodProps.createdAt;
  dbProd.updatedAt = prodProps.updatedAt;

  beforeEach(async () => {
    module = await mockCatalogModule().compile();
    service = await module.resolve(ProductService);
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
      const saveFn = jest.fn().mockResolvedValue(dbProd);
      // GIVEN
      module = await mockCatalogModule()
        .overrideProvider(ProductsRepository)
        .useValue({
          save: saveFn,
        })
        .compile();
      const repo = await module.resolve(ProductsRepository);
      const saveSpy = jest.spyOn(repo, "save");

      service = await module.resolve(ProductService);
      // WHEN
      const result = await service.findAndUpdateOrCreate(dto);
      // THEN
      expect(result.raw()).toEqual(prodProps);
      expect(saveSpy).toBeCalledWith(
        new Product({
          id: undefined,
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
          createdAt: undefined,
          updatedAt: undefined,
          productTypeId: undefined,
          variants: [],
        })
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
