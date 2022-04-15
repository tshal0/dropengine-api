import { UseGuards, Controller, Inject, Get, Param } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Versions } from "@shared/Constants";
import { EntityNotFoundException } from "@shared/exceptions";
import { MyEasySuiteClient } from "../MyEasySuiteClient";
import { Request, Response as ExpressResponse } from "express";

@UseGuards(AuthGuard())
@Controller({ path: "myeasysuite", version: Versions.v1 })
export class MyEasySuiteController {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly client: MyEasySuiteClient
  ) {}

  @Get("/variants/:id")
  async getById(@Param("id") id: string) {
    return await this.client.getVariantBySku(id);
  }
}
