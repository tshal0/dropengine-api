import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { UUID } from "@shared/domain";
import { AzureStorageService } from "@shared/modules";
import { PreviewService } from "./preview.service";

@Controller("preview")
export class PreviewController {
  private readonly logger: Logger = new Logger(PreviewController.name);

  constructor(
    private readonly _storage: AzureStorageService,
    private readonly _service: PreviewService
  ) {}

  @Get(":id")
  async get(@Param("id") id: string) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const name = UUID.generate().value();
    const resp = await this._storage.uploadFile(
      "previews",
      `${name}.png`,
      file.buffer
    );
    const url = resp.blob.url;
    this.logger.debug({ ...resp.upload_response, url });
    return { url };
  }
}
