export interface MerchantProduct {
  id: number;
  store: Store;
  title: string;
  product_type: string | null;
  design_elements: DesignElement[] | null;
  store_product_id: number;
  duplicate_unique_id: string;
}

export interface DesignElement {
  image_url: string;
  is_deleted: Is;
  is_required: Is;
  master_design: MasterDesign;
  is_master_required: Is;
}

export enum Is {
  N = "N",
  Y = "Y",
}

export interface MasterDesign {
  name: string;
  type: Type;
  width: number;
  height: number;
  image_url: string;
  resolution: number;
  description: string;
  is_required: Is;
}

export enum Type {
  Etch = "Etch",
  Front = "Front",
}

export interface Store {
  name: string;
  email: string;
}
