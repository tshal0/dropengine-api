import { IMoney, InvalidMoney, Money } from ".";

describe("Money", () => {
  describe("from", () => {
    describe("given valid value, currency", () => {
      it(`should return OK`, () => {
        let dto: IMoney = { currency: "USD", total: 1250 };
        let result = Money.from(dto);
        expect(result.isFailure).toBe(false);
        let value = result.value().value();
        expect(value).toMatchObject(dto);
      });
    });
    describe("given invalid currency:", () => {
      describe("empty string", () => {
        it(`should return InvalidMoneyCurrency`, () => {
          let dto: IMoney = { currency: "asdf" as unknown as "USD", total: 1 };
          let result = Money.from(dto);
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message:
              "InvalidMoneyCurrency: 'asdf' is not a valid currency. Please use 'USD'.",
            name: "InvalidMoneyCurrency",
            reason: "'asdf' is not a valid currency. Please use 'USD'.",
            value: {
              currency: "asdf" as unknown as "USD",
              total: 1,
            },
          } as InvalidMoney);
        });
      });
      describe("null", () => {
        it(`should return InvalidMoneyCurrency`, () => {
          let dto: IMoney = { currency: null as unknown as "USD", total: 1 };
          let result = Money.from(dto);
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message:
              "InvalidMoneyCurrency: 'null' is not a valid currency. Please use 'USD'.",
            name: "InvalidMoneyCurrency",
            reason: "'null' is not a valid currency. Please use 'USD'.",
            value: {
              currency: null as unknown as "USD",
              total: 1,
            },
          } as InvalidMoney);
        });
      });
      describe("undefined", () => {
        it(`should return InvalidMoneyCurrency`, () => {
          let dto: IMoney = {
            currency: undefined as unknown as "USD",
            total: 1,
          };
          let result = Money.from(dto);
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message:
              "InvalidMoneyCurrency: 'undefined' is not a valid currency. Please use 'USD'.",
            name: "InvalidMoneyCurrency",
            reason: "'undefined' is not a valid currency. Please use 'USD'.",
            value: {
              currency: undefined as unknown as "USD",
              total: 1,
            },
          } as InvalidMoney);
        });
      });
    });

    describe("given invalid total", () => {
      describe("decimal number", () => {
        it(`should return InvalidMoneyTotal`, () => {
          let dto: IMoney = { currency: "USD", total: 11.5 };
          let result = Money.from(dto);
          expect(result.isFailure).toBe(false);
          const value = result.value().value();
          expect(value).toMatchObject({
            currency: "USD",
            total: 1150,
          });
        });
      });
      describe("null", () => {
        it(`should return InvalidMoneyTotal`, () => {
          let dto: IMoney = { currency: "USD", total: null };
          let result = Money.from(dto);
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message:
              "InvalidMoneyTotal: 'null' is not an integer. Please use a round number, with no decimals.",
            name: "InvalidMoneyTotal",
            reason:
              "'null' is not an integer. Please use a round number, with no decimals.",
            value: { currency: "USD", total: null },
          } as InvalidMoney);
        });
      });
      describe("undefined", () => {
        it(`should return InvalidMoneyTotal`, () => {
          let dto: IMoney = { currency: "USD", total: undefined };
          let result = Money.from(dto);
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message:
              "InvalidMoneyTotal: 'undefined' is not an integer. Please use a round number, with no decimals.",
            name: "InvalidMoneyTotal",
            reason:
              "'undefined' is not an integer. Please use a round number, with no decimals.",
            value: { currency: "USD", total: undefined },
          } as InvalidMoney);
        });
      });
    });
  });
  describe("fromString", () => {
    describe("given valid total string (decimal)", () => {
      it(`should return OK`, () => {
        let moneyString = "12.50";
        let currency = "USD";
        let result = Money.fromString(moneyString, currency);
        expect(result.isFailure).toBe(false);
        let value = result.value().value();
        expect(value).toMatchObject({ currency: "USD", total: 1250 });
      });
    });
    describe("given invalid total string", () => {
      describe("empty string", () => {
        it(`should return InvalidMoneyTotal`, () => {
          let result = Money.fromString("", "USD");
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message:
              "InvalidMoneyTotal: '' is not a number. Please use a number for the Money value.",
            name: "InvalidMoneyTotal",
            reason:
              "'' is not a number. Please use a number for the Money value.",
            value: { currency: "USD", total: "" as unknown as number },
          } as InvalidMoney);
        });
      });
      describe("null", () => {
        it(`should return InvalidMoneyTotal`, () => {
          let result = Money.fromString(null, "USD");
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message:
              "InvalidMoneyTotal: 'null' is not a number. Please use a number for the Money value.",
            name: "InvalidMoneyTotal",
            reason:
              "'null' is not a number. Please use a number for the Money value.",
            value: { currency: "USD", total: null },
          } as InvalidMoney);
        });
      });
      describe("undefined", () => {
        it(`should return InvalidMoneyTotal`, () => {
          let result = Money.fromString(undefined, "USD");
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message:
              "InvalidMoneyTotal: 'undefined' is not a number. Please use a number for the Money value.",
            name: "InvalidMoneyTotal",
            reason:
              "'undefined' is not a number. Please use a number for the Money value.",
            value: { currency: "USD", total: undefined },
          } as InvalidMoney);
        });
      });
    });
  });
});
