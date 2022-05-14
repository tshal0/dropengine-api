import { cloneDeep } from "lodash";
import { mockAddress } from "../../mocks/mockAddress";
import { ISalesOrderAddress, SalesOrderAddress } from "./SalesOrderAddress";

describe("SalesOrderAddress", () => {
  describe("given valid AddressDto", () => {
    it("should return SalesOrderAddress", async () => {
      const mock = cloneDeep(mockAddress);
      let result = await SalesOrderAddress.from(mock);
      expect(result.isFailure).toBe(false);
      const props = result.value().value();
      expect(props).toEqual(mock);
    });
  });
  describe("given null", () => {
    it("should fail", async () => {
      const mock = null;
      let result = await SalesOrderAddress.from(mock);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        inner: [],
        value: null,
        reason: "SalesOrderAddress must be a valid Address.",
        name: "InvalidSalesOrderAddress",
        message:
          "InvalidSalesOrderAddress: SalesOrderAddress must be a valid Address.",
      };

      expect(error).toEqual(expected);
    });
  });
  describe("given invalid AddressDto", () => {
    it("should fail", async () => {
      const mock: ISalesOrderAddress = {
        zip: "",
        city: "",
        name: "",
        phone: "",
        company: "",
        country: "",
        address1: "",
        address2: "",
        address3: "",
        latitude: 0,
        longitude: 0,
        province: "",
        lastName: "",
        firstName: "",
        countryCode: "",
        provinceCode: "",
      };
      let result = await SalesOrderAddress.from(mock);
      expect(result.isFailure).toBe(true);
      const error = result.error;
      const expected = {
        inner: [
          {
            value: {
              value: "",
              property: "zip",
              children: [],
              constraints: {
                isNotEmpty: "zip should not be empty",
              },
            },
            reason: "'zip' is invalid.",
            name: "AddressValidationError",
            message:
              "AddressValidationError 'An instance of an object has failed the validation:\n - property zip has failed the following constraints: isNotEmpty \n': 'zip' is invalid.",
          },
          {
            value: {
              value: "",
              property: "city",
              children: [],
              constraints: {
                isNotEmpty: "city should not be empty",
              },
            },
            reason: "'city' is invalid.",
            name: "AddressValidationError",
            message:
              "AddressValidationError 'An instance of an object has failed the validation:\n - property city has failed the following constraints: isNotEmpty \n': 'city' is invalid.",
          },
          {
            value: {
              value: "",
              property: "name",
              children: [],
              constraints: {
                isNotEmpty: "name should not be empty",
              },
            },
            reason: "'name' is invalid.",
            name: "AddressValidationError",
            message:
              "AddressValidationError 'An instance of an object has failed the validation:\n - property name has failed the following constraints: isNotEmpty \n': 'name' is invalid.",
          },
          {
            value: {
              value: "",
              property: "address1",
              children: [],
              constraints: {
                isNotEmpty: "address1 should not be empty",
              },
            },
            reason: "'address1' is invalid.",
            name: "AddressValidationError",
            message:
              "AddressValidationError 'An instance of an object has failed the validation:\n - property address1 has failed the following constraints: isNotEmpty \n': 'address1' is invalid.",
          },
          {
            value: {
              value: "",
              property: "province",
              children: [],
              constraints: {
                isNotEmpty: "province should not be empty",
              },
            },
            reason: "'province' is invalid.",
            name: "AddressValidationError",
            message:
              "AddressValidationError 'An instance of an object has failed the validation:\n - property province has failed the following constraints: isNotEmpty \n': 'province' is invalid.",
          },
          {
            value: {
              value: "",
              property: "lastName",
              children: [],
              constraints: {
                isNotEmpty: "lastName should not be empty",
              },
            },
            reason: "'lastName' is invalid.",
            name: "AddressValidationError",
            message:
              "AddressValidationError 'An instance of an object has failed the validation:\n - property lastName has failed the following constraints: isNotEmpty \n': 'lastName' is invalid.",
          },
          {
            value: {
              value: "",
              property: "countryCode",
              children: [],
              constraints: {
                isNotEmpty: "countryCode should not be empty",
              },
            },
            reason: "'countryCode' is invalid.",
            name: "AddressValidationError",
            message:
              "AddressValidationError 'An instance of an object has failed the validation:\n - property countryCode has failed the following constraints: isNotEmpty \n': 'countryCode' is invalid.",
          },
          {
            value: {
              value: "",
              property: "provinceCode",
              children: [],
              constraints: {
                isNotEmpty: "provinceCode should not be empty",
              },
            },
            reason: "'provinceCode' is invalid.",
            name: "AddressValidationError",
            message:
              "AddressValidationError 'An instance of an object has failed the validation:\n - property provinceCode has failed the following constraints: isNotEmpty \n': 'provinceCode' is invalid.",
          },
        ],
        value: {
          zip: "",
          city: "",
          name: "",
          phone: "",
          company: "",
          country: "",
          address1: "",
          address2: "",
          address3: "",
          latitude: 0,
          longitude: 0,
          province: "",
          lastName: "",
          firstName: "",
          countryCode: "",
          provinceCode: "",
        },
        reason:
          "SalesOrderAddress encountered validation errors. See inner for details.",
        name: "InvalidSalesOrderAddress",
        message:
          "InvalidSalesOrderAddress: SalesOrderAddress encountered validation errors. See inner for details.",
      };
      expect(error).toEqual(expected);
    });
  });
});
