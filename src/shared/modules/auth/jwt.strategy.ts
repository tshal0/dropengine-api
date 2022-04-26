import {
  Injectable,
  UnauthorizedException,
  Inject,
  Logger,
  LoggerService,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as BaseStrategy, ExtractJwt } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { JwtPayload } from "./jwt.payload";
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  private readonly logger: Logger = new Logger(JwtStrategy.name);

  constructor(config: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${config.get<string>(
          "AUTH0_DOMAIN"
        )}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.get<string>("AUTH0_API_AUDIENCE"),
      issuer: `https://${config.get<string>("AUTH0_DOMAIN")}/`,
      algorithms: ["RS256"],
    });
    this.logger.debug(`Initialized JWT Passport Strategy!`);
  }

  validate(payload: JwtPayload): JwtPayload {
    const minimumScope = ["openid", "profile", "email"];
    if (
      payload?.scope
        ?.split(" ")
        .filter((scope) => minimumScope.indexOf(scope) > -1).length !== 3
    ) {
      throw new UnauthorizedException(
        "JWT does not possess the required scope (`openid profile email`)."
      );
    }

    return payload;
  }
}
