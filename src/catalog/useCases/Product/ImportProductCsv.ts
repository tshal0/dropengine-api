// import { Injectable, Scope } from "@nestjs/common";
// import { UseCase } from "@shared/domain/UseCase";
// import { ProductTypesRepository } from "../../database/ProductTypesRepository";

// import moment from "moment";
// import { Result, ResultError } from "@shared/domain/Result";
// import { Readable } from "stream";
// import csv from "csvtojson";
// import { IProductProps, Product, ProductTypeName } from "@catalog/domain";
// import { CreateProductDto } from "@catalog/dto/Product/CreateProductDto";
// import { ProductType } from "@catalog/domain/aggregates/ProductType";
// import { CsvProductDto } from "@catalog/dto/Product/CsvProductDto";

// //TODO: Extract CsvProductDtos from stream, load into Products, save to DB
// /**
//  * Requirements:
//  * 1. ImportProductCsv must be able to create (if Id and Sku are empty).
//  * 2. ImportProductCsv must be able to update (if Id or Sku are filled).
//  * 3. ImportProductCsv must be able to create (if Sku is filled and NOT EXIST).
//  */

// export class ImportProductResponse {
//   constructor(public errors: ResultError[], public imported: IProductProps[]) {}
// }
// export interface IGroupedCsvProducts {
//   [key: string]: CreateProductDto[];
// }
// export class GroupedCsvProducts {
//   constructor(protected props?: IGroupedCsvProducts | undefined) {
//     if (!props) this.props = {};
//   }
//   public get(key: string) {
//     this.init(key);
//     return this.props[key];
//   }
//   public set(key: string, val: CreateProductDto) {
//     this.init(key);
//     this.props[key].push(val);
//     return this;
//   }
//   public keys() {
//     return Object.keys(this.props);
//   }

//   private init(key: string) {
//     if (!this.props[key]?.length) {
//       this.props[key] = [];
//     }
//   }
// }
// export class ProcessImportedProductsResponse {
//   constructor(
//     public loadResults: Result<ProductType>[],
//     public importResults: Result<Product>[],
//     public saveResults: Result<ProductType>[]
//   ) {}
// }
// @Injectable({ scope: Scope.DEFAULT })
// export class ImportProductCsv implements UseCase<any, any> {
//   constructor(private readonly _typeRepo: ProductTypesRepository) {}
//   get llog() {
//     return `[${moment()}][${ImportProductCsv.name}]`;
//   }

//   async execute(stream: Readable): Promise<Result<ImportProductResponse>> {
//     let csvResults: Result<CreateProductDto>[] = [];
//     let productsByType = new GroupedCsvProducts();

//     try {
//       const parser = csv();
//       await parser.fromStream(stream).subscribe((obj) => {
//         return new Promise(async (resolve, reject) => {
//           let cp = CsvProductDto.create(obj);
//           let result = cp.toDto();
//           if (result.isFailure) {
//             csvResults.push(result);
//             return resolve();
//           }
//           let dto = result.value();
//           if (dto.type?.length > 0) {
//             productsByType.set(dto.type, dto);
//           } else {
//             //TODO: FailedToParseCsvProduct: MissingType
//           }
//           return resolve();
//         });
//       });

//       const types = productsByType.keys();
//       const results = await this.processImportedProductsByType(
//         types,
//         productsByType
//       );

//       const errors = [
//         ...results.loadResults,
//         ...results.saveResults,
//         ...results.importResults,
//         ...csvResults,
//       ]
//         .filter((r) => r.isFailure)
//         .map((r) => r.error);
//       const imported = results.importResults
//         .filter((r) => r.isSuccess)
//         .map((r) => r.value().props());

//       let resp = new ImportProductResponse(errors, imported);
//       return Result.ok(resp);
//     } catch (error) {
//       //TODO: FailedToImportProductCsv
//       return Result.fail(new ResultError(error, null, {}));
//     }
//   }
//   public async processImportedProductsByType(
//     skus: string[],
//     productsByType: GroupedCsvProducts
//   ): Promise<ProcessImportedProductsResponse> {
//     try {
//       let loadResults: Result<ProductType>[] = await this.loadTypes(skus);
//       let prodTypes = loadResults
//         .filter((r) => r.isSuccess)
//         .map((r) => r.value());
//       let importResults: Result<Product>[] = [];
//       let saveResults: Result<ProductType>[] = [];
//       for (const prodType of prodTypes) {
//         const name = prodType.name.value();
//         let dtos = productsByType.get(name);
//         for (const product of dtos) {
//           let result = await prodType.importProduct(product);
//           importResults.push(result);
//         }
//         let saveResult = await this._typeRepo.save(prodType);
//         saveResults.push(saveResult);
//       }
//       return new ProcessImportedProductsResponse(
//         loadResults,
//         importResults,
//         saveResults
//       );
//     } catch (err) {
//       throw err;
//     }
//   }
//   public async loadTypes(types: string[]) {
//     let loadResults: Result<ProductType>[] = [];
//     if (types?.length) {
//       loadResults = await Promise.all(
//         await types.map(
//           async (type) =>
//             await this._typeRepo.load(ProductTypeName.from(type).value())
//         )
//       );
//     }
//     return loadResults;
//   }
// }
