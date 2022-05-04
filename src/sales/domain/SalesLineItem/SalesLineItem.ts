import moment from "moment";
import { IAggregate, Result, ResultError } from "@shared/domain";
import { MongoSalesLineItem } from "@sales/database";
import {
  ISalesLineItem,
  ILineItemProperty,
  ISalesLineItemProps,
} from "./ISalesLineItem";
import { Personalization } from "./Personalization";
import { OrderFlag } from "./OrderFlag";
import { SalesVariant } from "../SalesVariant";
import { LineItemID } from "./LineItemID";
import { LineNumber } from "./LineNumber";
import { Quantity } from "./Quantity";
import { isNull } from "lodash";
import { CreateLineItemDto, LineItemPropertyDto } from "@sales/dto";
import { HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { SalesOrderID } from "../SalesOrder";

/**
 * Aggregates need: events, domain methods, initializers, converters
 */
export enum SalesLineItemError {
  InvalidLineItem = "InvalidLineItem",
  InvalidPersonalization = "InvalidPersonalization",
}
export class InvalidLineItem implements ResultError {
  public stack: string;
  public name = SalesLineItemError.InvalidLineItem;
  public message: string;
  constructor(
    public inner: ResultError[],
    public value: any,
    public reason: string
  ) {
    this.message = `${this.name} '${this.value?.id}' '${this.value?.lineNumber}': ${reason}`;
  }
}

export class SalesLineItem extends IAggregate<
  ISalesLineItemProps,
  ISalesLineItem,
  MongoSalesLineItem
> {
  private constructor(val: ISalesLineItem, doc: MongoSalesLineItem) {
    super(val, doc);
  }

  public get id(): string {
    return this._value.id.value();
  }

  public props(): ISalesLineItemProps {
    let props: ISalesLineItemProps = {
      id: this._value.id.value(),
      lineNumber: this._value.lineNumber.value(),
      quantity: this._value.quantity.value(),
      variant: this._value.variant.props(),
      personalization: this._value.personalization,
      flags: this._value.flags,
      createdAt: this._value.createdAt,
      updatedAt: this._value.updatedAt,
    };
    return props;
  }
  public entity(): MongoSalesLineItem {
    return Object.seal(this._entity);
  }

  /** VALIDATION */

  public validatePersonalization(): OrderFlag[] {
    const props = this.props();
    let flags = Personalization.validate(props);
    return flags;
  }

  public async updatePersonalization(
    personalization: ILineItemProperty[]
  ): Promise<SalesLineItem> {
    this._entity.personalization = personalization;
    this._value.personalization = personalization;
    let flags = this.validatePersonalization();
    if (flags.length) {
      throw new InvalidPersonalizationException(
        { lineItemId: this.id, personalization, flags },
        `Flagged for validation errors.`,
        SalesLineItemError.InvalidPersonalization,
        flags
      );
    }
    return this;
  }

  /** UTILITY METHODS */

  public static create(dto: CreateLineItemDto): SalesLineItem {
    if (isNull(dto)) throw SalesLineItem.nullLineItem();
    const variantResult = SalesVariant.create(dto.variant);

    let results: { [key: string]: Result<any> } = {};
    results.id = LineItemID.from(null);
    results.lineNumber = LineNumber.from(dto.lineNumber);
    results.quantity = Quantity.from(dto.quantity);
    results.variant = variantResult;

    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      throw SalesLineItem.invalidLineItem(errors, dto);
    }

    const now = moment().toDate();
    const variant = results.variant.value();

    const value: ISalesLineItem = {
      id: results.id.value(),
      lineNumber: results.lineNumber.value(),
      quantity: results.quantity.value(),
      variant: variant,
      personalization: dto.properties,
      createdAt: now,
      updatedAt: now,
      flags: [],
    };

    const doc = new MongoSalesLineItem();
    doc.lineNumber = value.lineNumber.value();
    doc.quantity = value.quantity.value();
    doc.variant = value.variant.entity();
    doc.personalization = value.personalization;
    doc.createdAt = now;
    doc.updatedAt = now;
    const lineItem = new SalesLineItem(value, doc);
    value.flags = lineItem.validatePersonalization();
    doc.flags = value.flags;
    return lineItem;
  }

  public static load(doc: MongoSalesLineItem): SalesLineItem {
    if (isNull(doc)) throw SalesLineItem.nullLineItem();
    const variantResult = SalesVariant.db(doc.variant);

    let results: { [key: string]: Result<any> } = {};

    results.id = LineItemID.from(doc._id);
    results.lineNumber = LineNumber.from(doc.lineNumber);
    results.quantity = Quantity.from(doc.quantity);
    results.variant = variantResult;

    // Errors
    let errors = Object.values(results)
      .filter((r) => r.isFailure)
      .map((r) => r as Result<any>)
      .map((r) => r.error);
    if (errors.length) {
      throw SalesLineItem.failedToLoadLineItem(errors, doc);
    }

    const now = moment().toDate();
    const variant = results.variant.value();

    const value: ISalesLineItem = {
      id: results.id.value(),
      lineNumber: results.lineNumber.value(),
      quantity: results.quantity.value(),
      variant: variant,
      personalization: doc.personalization,
      createdAt: now,
      updatedAt: now,
      flags: [],
    };

    const lineItem = new SalesLineItem(value, doc);
    value.flags = lineItem.validatePersonalization();
    doc.flags = value.flags;
    return lineItem;
  }
  private static nullLineItem(): ResultError {
    return new InvalidLineItem(
      [],
      null,
      `Failed to create LineItem. LineItem is undefined.`
    );
  }
  private static invalidLineItem(
    errors: ResultError[],
    dto: CreateLineItemDto
  ): ResultError {
    return new InvalidLineItem(
      errors,
      { ...dto },
      `Failed to create LineItem. See inner error for details.`
    );
  }

  private static failedToLoadLineItem(
    errors: ResultError[],
    doc: MongoSalesLineItem
  ): ResultError {
    return new InvalidLineItem(
      errors,
      { ...doc },
      `Failed to load LineItem. See inner error for details.`
    );
  }
}

export class InvalidPersonalizationException extends InternalServerErrorException {
  constructor(
    dto: {
      lineItemId: string;
      personalization: ILineItemProperty[];
      flags: OrderFlag[];
    },
    reason: any,
    type: SalesLineItemError,
    inner: any[]
  ) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          `Failed to update personalization for line item ` +
          `'${dto.lineItemId}': ` +
          `${reason}`,
        timestamp: moment().toDate(),
        error: type,
        details: {
          lineItemId: dto.lineItemId,
          personalization: dto.personalization,
          reason,
          inner,
        },
      },
      `Failed to update personalization for line item ` +
        `'${dto.lineItemId}': ` +
        `${reason}`
    );
  }
}
