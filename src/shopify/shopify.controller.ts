import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AcceptShopifyInstallDto } from "./dto/AcceptShopifyInstallDto";
import { ConnectShopifyAccountDto } from "./dto/ConnectShopifyAccountDto";
import moment from "moment";
import { ConfigService } from "@nestjs/config";
import { AzureLoggerService } from "@shared/modules/azure-logger/azure-logger.service";
import { AcceptShopifyInstallUseCase } from "./useCases/AcceptShopifyInstallUseCase";
import { ConnectShopifyAccountUseCase } from "./useCases/ConnectShopifyAccount";

@Controller("shopify")
export class ShopifyController {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: AzureLoggerService,
    private readonly acceptShopifyInstall: AcceptShopifyInstallUseCase,
    private readonly createShopifyAccount: ConnectShopifyAccountUseCase
  ) {}
  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )
  public async get(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: ConnectShopifyAccountDto
  ) {
    let dto: ConnectShopifyAccountDto =
      req.query as unknown as ConnectShopifyAccountDto;
    if (!dto.timestamp) dto.timestamp = moment().valueOf();

    let result = await this.createShopifyAccount.execute(query);
    // let account = result.value().props();
    // res.cookie("state", account.installation.nonce);
    // res.redirect(account.installation.installLink);
  }
  @Get("/install")
  public async shopifyInstall(@Req() req: Request, @Res() res: Response) {
    let dto: AcceptShopifyInstallDto =
      req.query as unknown as AcceptShopifyInstallDto;
    let result = await this.acceptShopifyInstall.execute(dto);
    // let account = result.value().props();

    try {
      res.redirect(`/home`);
    } catch (err) {}
  }
}
