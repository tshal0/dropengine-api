import { Entity } from "./entity";

export interface UnmarshalledLineItem {
  id?: string;
  sku: string;
  displayName: string;
  quantity: number;
}

export class LineItem extends Entity<UnmarshalledLineItem> {
  private constructor(props: UnmarshalledLineItem) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: UnmarshalledLineItem): LineItem {
    const instance = new LineItem(props);
    return instance;
  }

  public unmarshal(): UnmarshalledLineItem {
    return {
      id: this.id,
      sku: this.sku,
      displayName: this.displayName,
      quantity: this.quantity,
    };
  }

  get id(): string {
    return this._id;
  }

  get sku(): string {
    return this.props.sku;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get quantity(): number {
    return this.props.quantity;
  }
}
