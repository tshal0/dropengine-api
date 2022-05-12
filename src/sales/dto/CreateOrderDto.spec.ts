import { CreateOrderDto } from "./CreateOrderDto";
import {
  expectedCreateOrderDto,
  mockCreateOrderDto,
  mockCreateOrderDtoLineItems,
} from "./CreateOrderDto.mock";

describe("CreateOrderDto", () => {
  describe("given valid constructor", () => {
    it("should generate a valid DTO", () => {
      // GIVEN valid DTO

      // WHEN
      const createOrderDto: CreateOrderDto = Object.assign(
        new CreateOrderDto(),
        mockCreateOrderDto
      );
      createOrderDto.lineItems = mockCreateOrderDtoLineItems;

      // THEN

      expect(createOrderDto).toEqual(expectedCreateOrderDto);
    });
  });
});
