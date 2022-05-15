import { ValueObject } from "./ValueObject";
import { isInteger, isNaN, isNull, isUndefined, toNumber } from "lodash";
import { Result, ResultError } from "../Result";

export interface IMoney {
  total: number;
  currency: "USD";
}

export enum MoneyError {
  InvalidMoney = "InvalidMoney",
  InvalidMoneyTotal = "InvalidMoneyTotal",
  InvalidMoneyCurrency = "InvalidMoneyCurrency",
}

export class InvalidMoney implements ResultError {
  public stack: string;
  public name = MoneyError.InvalidMoney;
  public message: string;
  public inner: ResultError[];

  constructor(public value: IMoney, public reason: string) {
    this.message = `${MoneyError.InvalidMoney}: ${reason}`;
  }
}
export class InvalidMoneyTotal implements ResultError {
  public stack: string;
  public name = MoneyError.InvalidMoneyTotal;
  public message: string;
  public inner: ResultError[];

  constructor(public value: any, public reason: string) {
    this.message = `${MoneyError.InvalidMoneyTotal}: ${reason}`;
  }
}
export class InvalidMoneyCurrency implements ResultError {
  public stack: string;
  public name = MoneyError.InvalidMoneyCurrency;
  public message: string;
  public inner: ResultError[];

  constructor(public value: IMoney, public reason: string) {
    this.message = `${MoneyError.InvalidMoneyCurrency}: ${reason}`;
  }
}

/**
 * Stores money as an integer, currency tuple.
 * If initialized with a float, the value
 */
export class Money extends ValueObject<IMoney> {
  static from(dto: IMoney): Result<Money> {
    if (typeof dto.total == "string") {
      dto.total = toNumber(dto.total);
    }
    if (isFloat(dto.total)) {
      if (dto.currency == "USD") {
        dto.total = Math.round(dto.total * 100);
      }
    }
    if (!isInteger(dto?.total)) {
      return Result.fail(
        new InvalidMoneyTotal(
          dto,
          `'${dto?.total}' is not an integer. Please use a round number, with no decimals.`
        )
      );
    }
    if (!["USD"].includes(dto?.currency)) {
      return Result.fail(
        new InvalidMoneyCurrency(
          dto,
          `'${dto?.currency}' is not a valid currency. Please use 'USD'.`
        )
      );
    }
    let money = new Money({ currency: dto?.currency, total: dto?.total });
    return Result.ok(money);
  }

  static fromString(total: string, currency: string): Result<Money> {
    if (
      !total?.length ||
      isNaN(+total) ||
      isNull(total) ||
      isUndefined(total)
    ) {
      return Result.fail(
        new InvalidMoneyTotal(
          { total, currency },
          `'${total}' is not a number. Please use a number for the Money value.`
        )
      );
    }
    let floatTotal = +total;
    let intTotal = Math.round(floatTotal * 100);
    let dto: IMoney = { currency: currency as "USD", total: intTotal };
    let result = Money.from(dto);
    return result;
  }
  static default(): Money {
    return new Money({ currency: "USD", total: 0 });
  }
}

export function isFloat(n) {
  return n === +n && n !== (n | 0);
}
