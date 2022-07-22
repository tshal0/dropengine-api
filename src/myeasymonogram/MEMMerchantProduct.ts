export interface MEMProduct {
  id: number;
  store: MEMStore;
  title: string;
  product_type: string | null;
  design_elements: MEMDesignElement[] | null;
  store_product_id: number;
  duplicate_unique_id: string;
}

export interface MEMDesignElement {
  id: number;
  duplicate_unique_id: string;
  image_url: string;
  is_deleted: Is;
  is_required: Is;
  master_design: MEMMasterDesign;
  is_master_required: Is;
}

export enum Is {
  N = "N",
  Y = "Y",
}

export interface MEMMasterDesign {
  name: string;
  type: MEMDesignType | string;
  width: number;
  height: number;
  image_url: string;
  resolution: number;
  description: string;
  is_required: Is;
}

export enum MEMDesignType {
  Etch = "Etch",
  Front = "Front",
}

export interface MEMStore {
  name: string;
  email: string;
}
