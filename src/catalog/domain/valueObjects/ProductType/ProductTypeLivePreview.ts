import { Result, ValueObject } from "@shared/domain";

export interface IProductTypeLivePreview {
  [key: string]: any;
  enabled: boolean;
  name: string;
  link: string;
  version: string;
}
export class ProductTypeLivePreview extends ValueObject<IProductTypeLivePreview> {
  static from(dto: IProductTypeLivePreview): Result<ProductTypeLivePreview> {
    return Result.ok(new ProductTypeLivePreview(dto));
  }
}
