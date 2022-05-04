import { ValidationError } from "class-validator";
import { Entity } from "./entity";
import { LineItem, UnmarshalledLineItem } from "./LineItem";

export interface UnmarshalledOrder {
  id: string;
  lineItems: UnmarshalledLineItem[];
}

export interface OrderProps {
  id?: string;
  rawProducts?: UnmarshalledLineItem[];
}

export class Order extends Entity<OrderProps> {
  private _lineItems: LineItem[];

  private constructor({ id, ...data }: OrderProps) {
    super(data, id);
  }

  public static create(props: OrderProps): Order {
    const instance = new Order(props);
    instance.lineItems = instance.props.rawProducts || [];
    return instance;
  }

  public unmarshal(): UnmarshalledOrder {
    return {
      id: this.id,
      lineItems: this.lineItems.map((li) => li.unmarshal()),
    };
  }

  private static validQuantity(quantity: number) {
    return quantity >= 1 && quantity <= 1000;
  }

  get id(): string {
    return this._id;
  }

  get lineItems(): LineItem[] {
    return this._lineItems;
  }

  set lineItems(lineItems: LineItem[] | UnmarshalledLineItem[]) {
    this._lineItems = lineItems.map((p) =>
      p instanceof LineItem ? p : LineItem.create(p.item)
    );
  }

  public empty(): void {
    this.lineItems = [];
  }
}
