import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  async check(): Promise<any> {
    return { status: "DropEngine™ API Up!" };
  }
}
