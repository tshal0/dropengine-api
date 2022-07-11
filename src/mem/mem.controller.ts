import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { MemService } from "./mem.service";

@Controller("mem")
export class MemController {
  constructor(private client: MemService) {}
  @UseGuards(AuthGuard())
  @Get("/designs")
  async getDesigns() {
    return await this.client.queryDesigns();
  }
}
