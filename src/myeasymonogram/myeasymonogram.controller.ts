import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MyEasyMonogramService } from "./myeasymonogram.service";

@Controller("mem")
export class MyEasyMonogramController {
  constructor(private client: MyEasyMonogramService) {}
  @UseGuards(AuthGuard())
  @Get("/designs")
  async getDesigns() {
    return await this.client.queryDesigns();
  }
  @UseGuards(AuthGuard())
  @Get("/designs/:id")
  async getDesign(@Param("id") id: string) {
    return await this.client.getDesign(id);
  }
}
