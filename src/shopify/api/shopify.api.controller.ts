import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthorizedUser } from "@shared/domain/Auth0User";
import { UUID } from "@shared/domain/valueObjects";
import { AzureTelemetryService } from "@shared/modules/azure-telemetry/azure-telemetry.service";
import { IsNotEmpty, IsInt } from "class-validator";
import { Request } from "express";
import { ShopifyApiClient } from "../ShopifyApiClient";
import { ConnectShopifyAccountUseCase } from "../useCases/ConnectShopifyAccount";
import { DeleteShopifyAccountUseCase } from "../useCases/DeleteShopifyAccount";
import { GetAllAccountsUseCase } from "../useCases/GetAllAccounts";
import { GetShopifyAccountUseCase } from "../useCases/GetShopifyAccount";

export class ConnectShopifyQuery {
  @IsNotEmpty()
  shop: string;
  hmac?: string | undefined;
  @IsInt()
  timestamp?: number | undefined;
}

@Controller("shopify")
export class ShopifyApiController {
  private readonly logger: Logger = new Logger(ShopifyApiController.name);

  constructor(
    private readonly shopify: ShopifyApiClient,
    private readonly createAccount: ConnectShopifyAccountUseCase,
    private readonly getAccount: GetShopifyAccountUseCase,
    private readonly getAll: GetAllAccountsUseCase,
    private readonly deleteAccount: DeleteShopifyAccountUseCase
  ) {}
  @Get("install")
  async callback(@Req() req: Request) {
    let query = req.query;
    this.logger.debug(req.url, { query });
    // const queryMap = Object.assign({}, req.query);
    // delete queryMap['signature'];
    // delete queryMap['hmac'];
    // const providedHmac = Buffer.from(hmac, 'utf-8');
    // const generatedHash = Buffer.from(
    //   crypto
    //     .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    //     .update(message)
    //     .digest('hex'),
    //   'utf-8',
    // );
    // let hashEquals = false;
    // try {
    //   hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    // } catch (e) {
    //   hashEquals = false;
    // }
    // if (!hashEquals) {
    //   return res.status(400).send('HMAC validation failed');
    // }
    //   request
    //     .post(accessTokenRequestUrl, { json: accessTokenPayload })
    //     .then((accessTokenResponse) => {
    //       const accessToken = accessTokenResponse.access_token;
    //       const shopRequestURL =
    //         'https://' + shopName + '/admin/api/2020-04/shop.json';
    //       const shopRequestHeaders = { 'X-Shopify-Access-Token': accessToken };
    //       request
    //         .get(shopRequestURL, { headers: shopRequestHeaders })
    //         .then((shopResponse) => {
    //           res.redirect('https://' + shopName + '/admin/apps');
    //         })
    //         .catch((error) => {
    //           res.status(error.statusCode).send(error.error.error_description);
    //         });
    //     })
    //     .catch((error) => {
    //       res.status(error.statusCode).send(error.error.error_description);
    //     });
    // } else {
    //   res.status(400).send('Required parameters missing');
    // }
  }
  @Get(":id")
  async get(@Param("id") id: string) {
    let uuid = UUID.from(id);
    let result = await this.getAccount.execute(uuid.value());
    let account = result.value();
    return account.props();
  }
  @Delete(":id")
  async delete(@Param("id") id: string) {
    let uuid = UUID.from(id);
    let result = await this.deleteAccount.execute(uuid.value());

    return { message: `Deleted ${id}: ${result.isSuccess}` };
  }
  @UseGuards(AuthGuard())
  @Get()
  async connectShopifyStore(@Req() req: Request) {
    let user = AuthorizedUser.create(req);
    this.logger.debug(`User`, { user });
    let result = await this.getAll.execute();
    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }
    let val = result.value();
    let accounts = val.map((v) => v.props());
    return accounts;
  }
}
