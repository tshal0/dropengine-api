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
      const createOrderDto: CreateOrderDto = new CreateOrderDto(
        mockCreateOrderDto
      );
      let result = createOrderDto.applyLineItems(mockCreateOrderDtoLineItems);

      // THEN

      expect(result).toEqual(expectedCreateOrderDto);
    });
  });
});
