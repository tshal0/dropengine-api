import { CustomOption } from "./CustomOption";
import { CustomOptionDto } from "@catalog/dto/Product/CreateProductDto";
import {
  CustomOptionLabel,
  CustomOptionName,
  CustomOptionPlaceholder,
  CustomOptionRequired,
} from "./CustomOptionValueObjects";
import { CustomOptionType } from "./CustomOptionType";
import { CustomOptionMaxLength } from "./CustomOptionMaxLength";
import { CustomOptionPattern } from "./CustomOptionPattern";
import { CustomOptionOptions } from "./CustomOptionOptions";

jest
  .spyOn(global.Date, "now")
  .mockImplementation(() => new Date("2021-01-01T00:00:00.000Z").valueOf());
describe(`CustomOption`, () => {
  const mockBaseCustomOption = Object.seal({
    options: "A,B",
    name: "",
    label: "",
    placeholder: "",
    required: false,
    type: "",
  });
  describe(`create`, () => {
    describe("with valid DTO", () => {
      it(`should create a valid CustomOption`, () => {
        let dto: CustomOptionDto = {
          name: "CustomOption1",
          label: "Custom Option 1",
          placeholder: "Enter up to 16 characters",
          required: true,
          type: "input",
          maxLength: 16,
        };
        let result = CustomOption.from(dto);
        expect(result.isFailure).toBe(false);
        expect(result.value().props()).toEqual({
          name: "CustomOption1",
          label: "Custom Option 1",
          placeholder: "Enter up to 16 characters",
          required: true,
          type: "input",
          maxLength: 16,
        });
      });
    });
    describe("with invalid DTO props", () => {
      it(`should return InvalidCustomOption`, () => {
        let dto: CustomOptionDto = {
          name: null,
          label: null,
          placeholder: null,
          required: null,
          type: null,
          maxLength: null,
          options: null,
          pattern: null,
        };
        let result = CustomOption.from(dto);
        expect(result.isFailure).toBe(true);
        expect(result.error).toEqual({
          inner: [
            {
              message: "Name 'null' must not be empty.",
              name: "INVALID_CUSTOM_OPTION_NAME",
              value: null,
            },
            {
              message: "Label 'null' must not be empty.",
              name: "INVALID_CUSTOM_OPTION_LABEL",
              value: null,
            },
            {
              message: "Placeholder 'null' must not be empty.",
              name: "INVALID_CUSTOM_OPTION_PLACEHOLDER",
              value: null,
            },
            {
              message: "Required 'null' must be a boolean value.",
              name: "INVALID_CUSTOM_OPTION_REQUIRED",
              value: null,
            },
            {
              message:
                "Type 'null' must be one of the following: input, dropdownlist, select, dropdown, text",
              name: "INVALID_CUSTOM_OPTION_TYPE",
              value: null,
            },
          ],
          message: `Invalid CustomOption 'null' was found.`,
          name: "InvalidCustomOption",
          value: {
            name: null,
            label: null,
            placeholder: null,
            required: null,
            type: null,
            maxLength: null,
            options: null,
            pattern: null,
          },
        });
      });
    });
  });
  describe(`CustomOptionName`, () => {
    describe("with an empty Name", () => {
      it(`should return InvalidCustomOptionName`, () => {
        let result = CustomOptionName.from("");
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Name '' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_NAME`,
          value: "",
        });
      });
    });
    describe("with a null Name", () => {
      it(`should return InvalidCustomOptionName`, () => {
        let result = CustomOptionName.from(null);
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Name 'null' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_NAME`,
          value: null,
        });
      });
    });
    describe("with a undefined Name", () => {
      it(`should return InvalidCustomOptionName`, () => {
        let result = CustomOptionName.from(undefined);
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Name 'undefined' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_NAME`,
          value: undefined,
        });
      });
    });
    describe("with an valid Name", () => {
      it(`should return OK`, () => {
        let result = CustomOptionName.from("Test");
        expect(result.isFailure).toBe(false);
        expect(result.value().value()).toBe("Test");
      });
    });
  });
  describe(`CustomOptionLabel`, () => {
    describe("with an empty Label", () => {
      it(`should return InvalidCustomOptionLabel`, () => {
        let result = CustomOptionLabel.from("");
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Label '' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_LABEL`,
          value: "",
        });
      });
    });
    describe("with a null Label", () => {
      it(`should return InvalidCustomOptionLabel`, () => {
        let result = CustomOptionLabel.from(null);
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Label 'null' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_LABEL`,
          value: null,
        });
      });
    });
    describe("with a undefined Label", () => {
      it(`should return InvalidCustomOptionLabel`, () => {
        let result = CustomOptionLabel.from(undefined);
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Label 'undefined' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_LABEL`,
          value: undefined,
        });
      });
    });
    describe("with an valid Label", () => {
      it(`should return OK`, () => {
        let result = CustomOptionLabel.from("Test");
        expect(result.isFailure).toBe(false);
      });
    });
  });
  describe(`CustomOptionPlaceholder`, () => {
    describe("with an empty Placeholder", () => {
      it(`should return InvalidCustomOptionPlaceholder`, () => {
        let result = CustomOptionPlaceholder.from("");
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Placeholder '' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_PLACEHOLDER`,
          value: "",
        });
      });
    });
    describe("with a null Placeholder", () => {
      it(`should return InvalidCustomOptionPlaceholder`, () => {
        let result = CustomOptionPlaceholder.from(null);
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Placeholder 'null' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_PLACEHOLDER`,
          value: null,
        });
      });
    });
    describe("with a undefined Placeholder", () => {
      it(`should return InvalidCustomOptionPlaceholder`, () => {
        let result = CustomOptionPlaceholder.from(undefined);
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Placeholder 'undefined' must not be empty.`,
          name: `INVALID_CUSTOM_OPTION_PLACEHOLDER`,
          value: undefined,
        });
      });
    });
    describe("with an valid Placeholder", () => {
      it(`should return OK`, () => {
        let result = CustomOptionPlaceholder.from("Test");
        expect(result.isFailure).toBe(false);
      });
    });
  });
  describe(`CustomOptionRequired`, () => {
    describe("with non-bool Required", () => {
      it(`should return InvalidCustomOptionRequired`, () => {
        let result = CustomOptionRequired.from({} as unknown as boolean);
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Required '[object Object]' must be a boolean value.`,
          name: `INVALID_CUSTOM_OPTION_REQUIRED`,
          value: {},
        });
      });
    });
    describe("with null Required", () => {
      it(`should return InvalidCustomOptionRequired`, () => {
        let result = CustomOptionRequired.from(null);
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Required 'null' must be a boolean value.`,
          name: `INVALID_CUSTOM_OPTION_REQUIRED`,
          value: null,
        });
      });
    });
    describe("with valid Required: true", () => {
      it(`should return OK`, () => {
        let result = CustomOptionRequired.from(true);

        expect(result.isFailure).toBe(false);
        expect(result.value().value()).toBe(true);
      });
    });
    describe("with valid Required: false", () => {
      it(`should return OK`, () => {
        let result = CustomOptionRequired.from(false);

        expect(result.isFailure).toBe(false);
        expect(result.value().value()).toBe(false);
      });
    });
  });
  describe(`CustomOptionType`, () => {
    describe("with invalid Type", () => {
      it(`should return InvalidCustomOptionType`, () => {
        let result = CustomOptionType.from("asdf");
        expect(result.isFailure).toBe(true);
        let err = result.error;
        expect(err).toEqual({
          message: `Type 'asdf' must be one of the following: input, dropdownlist, select, dropdown, text`,
          name: `INVALID_CUSTOM_OPTION_TYPE`,
          value: "asdf",
        });
      });
    });
    describe("with valid Type: input", () => {
      it(`should return OK`, () => {
        let result = CustomOptionType.from("input");
        expect(result.isFailure).toBe(false);
        expect(result.value().value()).toBe("input");
      });
    });
    describe("with valid Type: dropdownlist", () => {
      it(`should return OK`, () => {
        let result = CustomOptionType.from("dropdownlist");
        expect(result.isFailure).toBe(false);
        expect(result.value().value()).toBe("dropdownlist");
      });
    });
    describe("with valid Type: select", () => {
      it(`should return OK`, () => {
        let result = CustomOptionType.from("select");
        expect(result.isFailure).toBe(false);
        expect(result.value().value()).toBe("select");
      });
    });
    describe("with valid Type: dropdown", () => {
      it(`should return OK`, () => {
        let result = CustomOptionType.from("dropdown");
        expect(result.isFailure).toBe(false);
        expect(result.value().value()).toBe("dropdown");
      });
    });
    describe("with valid Type: text", () => {
      it(`should return OK`, () => {
        let result = CustomOptionType.from("text");
        expect(result.isFailure).toBe(false);
        expect(result.value().value()).toBe("text");
      });
    });
  });
  describe(`CustomOptionMaxLength`, () => {
    describe(`with valid Type`, () => {
      describe(`and null MaxLength`, () => {
        it(`should return InvalidCustomOptionMaxLength`, () => {
          let result = CustomOptionMaxLength.from({
            ...mockBaseCustomOption,
            type: "input",
            maxLength: null,
          });
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message: `MaxLength 'null' must be a number greater than 0.`,
            name: `INVALID_CUSTOM_OPTION_MAX_LENGTH`,
            value: null,
          });
        });
      });
      describe(`and 0 MaxLength`, () => {
        it(`should return InvalidCustomOptionMaxLength`, () => {
          let result = CustomOptionMaxLength.from({
            ...mockBaseCustomOption,
            type: "input",
            maxLength: 0,
          });
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message: `MaxLength '0' must be a number greater than 0.`,
            name: `INVALID_CUSTOM_OPTION_MAX_LENGTH`,
            value: 0,
          });
        });
      });
      describe(`and valid MaxLength`, () => {
        it(`should return OK`, () => {
          let result = CustomOptionMaxLength.from({
            ...mockBaseCustomOption,
            type: "input",
            maxLength: 16,
          });
          expect(result.isFailure).toBe(false);
          expect(result.value().value()).toBe(16);
        });
      });
    });
    describe(`with invalid Type`, () => {});
  });
  describe(`CustomOptionPattern`, () => {
    describe(`with invalid Type`, () => {
      describe(`and non-null Pattern`, () => {
        it(`should return InvalidCustomOptionPattern`, () => {
          let result = CustomOptionPattern.from({
            ...mockBaseCustomOption,
            type: "dropdownlist",
            pattern: "test",
          });
          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message: `Pattern 'test' is not required for type 'dropdownlist'`,
            name: `INVALID_CUSTOM_OPTION_PATTERN`,
            value: "test",
          });
        });
      });
      describe(`and null Pattern`, () => {
        it(`should return InvalidCustomOptionPattern`, () => {
          let result = CustomOptionPattern.from({
            ...mockBaseCustomOption,
            type: "dropdownlist",
            pattern: null,
          });
          expect(result.isFailure).toBe(false);
          expect(result.value().value()).toBe(null);
        });
      });
    });
    describe(`with valid Type`, () => {
      describe(`and invalid Pattern`, () => {
        it(`should return InvalidCustomOptionPattern`, () => {
          let result = CustomOptionPattern.from({
            ...mockBaseCustomOption,
            type: "input",
            pattern: "[0-9]++",
          });

          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message: `Pattern '[0-9]++' must be a valid Regular Expression.`,
            name: `INVALID_CUSTOM_OPTION_PATTERN`,
            value: "[0-9]++",
          });
        });
      });
      describe(`and null Pattern`, () => {
        it(`should return InvalidCustomOptionPattern`, () => {
          let result = CustomOptionPattern.from({
            ...mockBaseCustomOption,
            type: "input",
            pattern: null,
          });
          expect(result.isFailure).toBe(false);
        });
      });
      describe(`and valid Pattern`, () => {
        it(`should return OK`, () => {
          let result = CustomOptionPattern.from({
            ...mockBaseCustomOption,
            type: "input",
            pattern: "^[a-zA-Z0-9\\s.,'/&]*",
          });

          expect(result.isFailure).toBe(false);
          expect(result.value().value().source).toBe("^[a-zA-Z0-9\\s.,'/&]*");
        });
      });
    });
  });

  describe(`CustomOptionOptions`, () => {
    describe(`with invalid Type`, () => {
      describe("and valid list of Options", () => {
        it(`should return InvalidCustomOptionOptions`, () => {
          let result = CustomOptionOptions.from({
            ...mockBaseCustomOption,
            type: "input",
            options: "A,B",
          });

          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message: `Options 'A,B' must not exist on CustomOptions with type 'input'.`,
            name: `INVALID_CUSTOM_OPTION_OPTIONS`,
            value: "A,B",
          });
        });
      });
      describe("and null or undefined Options", () => {
        it(`should return OK`, () => {
          let result = CustomOptionOptions.from({
            ...mockBaseCustomOption,
            type: "input",
            options: null,
          });
          expect(result.isFailure).toBe(false);
          expect(result.value().value()).toBe(null);
        });
      });
    });
    describe("with valid Type", () => {
      describe("and null Options", () => {
        it(`should return InvalidCustomOptionOptions`, () => {
          let result = CustomOptionOptions.from({
            ...mockBaseCustomOption,
            type: "dropdownlist",
            options: null,
          });

          expect(result.isFailure).toBe(true);
          let err = result.error;
          expect(err).toEqual({
            message: `Options 'null' must not be null or undefined.`,
            name: `INVALID_CUSTOM_OPTION_OPTIONS`,
            value: null,
          });
        });
      });
      describe("and undefined Options", () => {
        it(`should return InvalidCustomOptionOptions`, () => {
          let result = CustomOptionOptions.from({
            ...mockBaseCustomOption,
            type: "dropdownlist",
            options: undefined,
          });
          let err = result.error;
          expect(err).toEqual({
            message: `Options 'undefined' must not be null or undefined.`,
            name: `INVALID_CUSTOM_OPTION_OPTIONS`,
            value: undefined,
          });
        });
      });
      describe("and empty list of Options", () => {
        it(`should return InvalidCustomOptionOptions`, () => {
          let result = CustomOptionOptions.from({
            ...mockBaseCustomOption,
            type: "dropdownlist",
            options: "",
          });
          let err = result.error;
          expect(err).toEqual({
            message: `Options '' must have values with Type 'dropdownlist'.`,
            name: `INVALID_CUSTOM_OPTION_OPTIONS`,
            value: "",
          });
        });
      });
      describe("and Options with wrong type (object)", () => {
        it(`should return InvalidCustomOptionOptions`, () => {
          let result = CustomOptionOptions.from({
            ...mockBaseCustomOption,
            type: "dropdownlist",
            options: {} as unknown as string,
          });
          let err = result.error;
          expect(err).toEqual({
            message: `Options '[object Object]' must be a string.`,
            name: `INVALID_CUSTOM_OPTION_OPTIONS`,
            value: {},
          });
        });
      });
      describe("and valid list of Options", () => {
        it(`should return OK`, () => {
          let result = CustomOptionOptions.from({
            ...mockBaseCustomOption,
            type: "dropdownlist",
            options: "A,B",
          });
          expect(result.isFailure).toBe(false);
          expect(result.value().value()).toEqual("A,B");
        });
      });
    });
  });
});
