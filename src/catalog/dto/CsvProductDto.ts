import { Product } from "@catalog/domain";
import { IProductProps } from "@catalog/domain/interfaces";
import { Result } from "@shared/domain";
import { compact } from "lodash";
import { CreateProductDto, CustomOptionDto } from "./CreateProductDto";

export interface ICsvProductDto {
  Id: string;
  Sku: string;
  Code: string;
  PriceTier: string;

  Type: string;
  Tags: string;
  Categories: string;
  Image: string;
  Svg: string;
  Option1Name: string;
  Option2Name: string;
  Option3Name: string;
  CustomOption1: string;
  CustomOption2: string;
  CustomOption3: string;
  CustomOption4: string;
  CustomOption5: string;
  CustomOption6: string;
}

export class CsvProductDto {
  private constructor(private _props: ICsvProductDto) {}
  public get props(): ICsvProductDto {
    return Object.seal({ ...this._props });
  }
  public static create(dto: ICsvProductDto) {
    return new CsvProductDto(dto);
  }

  public toDto(): Result<CreateProductDto> {
    try {
      const options = compact([
        this._props.CustomOption1,
        this._props.CustomOption2,
        this._props.CustomOption3,
        this._props.CustomOption4,
        this._props.CustomOption5,
        this._props.CustomOption6,
      ]);
      const customOptions: CustomOptionDto[] = options.map((o) =>
        JSON.parse(o)
      );

      let props: CreateProductDto = {
        id: this._props.Id,
        sku: this._props.Sku,
        productTypeId: "",
        image: this._props.Image,
        svg: this._props.Svg,
        tags: this._props.Tags,
        customOptions: [...customOptions], //TODO: CustomOptions
        pricingTier: this._props.PriceTier,
        type: this._props.Type,
      };
      return Result.ok(props);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
