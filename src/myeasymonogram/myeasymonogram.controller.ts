import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MyEasyMonogramService } from "./myeasymonogram.service";

@Controller("myeasymonogram")
export class MyEasyMonogramController {
  constructor(private client: MyEasyMonogramService) {}
  @Get("/available_products")
  async getAvailable() {
    return await this.client.queryAvailable();
  }

  @UseGuards(AuthGuard())
  @Get("/merchant_products")
  async getDesigns() {
    return await this.client.queryDesigns();
  }
  @UseGuards(AuthGuard())
  @Get("/merchant_products/:id")
  async getDesign(@Param("id") id: string) {
    return await this.client.getDesign(id);
  }
}
