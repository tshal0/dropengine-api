import { ProductResponseDto } from "./ProductResponseDto";

export class QueryProductResponseDto {
  query: string;
  total: number;
  page: number;
  size: number;
  pages: number;
  data: ProductResponseDto[];
}
