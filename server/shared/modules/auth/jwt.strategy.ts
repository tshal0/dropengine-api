import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { JwtPayload } from './jwt.payload';
import { AzureLoggerService } from '../azure-logger/azure-logger.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(configService: ConfigService, logger: AzureLoggerService) {
    const DOMAIN = configService.get<string>('AUTH0_DOMAIN');
    const jwtSecretOptions = {
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${DOMAIN}/.well-known/jwks.json`,
    };
    const AUDIENCE = configService.get<string>('AUTH0_API_AUDIENCE');
    const issuer = `https://${DOMAIN}/`;
    logger.debug({ jwtSecretOptions, audience: AUDIENCE, issuer });
    super({
      secretOrKeyProvider: passportJwtSecret(jwtSecretOptions),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: AUDIENCE,
      issuer: issuer,
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    const minimumScope = ['openid', 'profile', 'email'];
    if (
      payload?.scope
        ?.split(' ')
        .filter((scope) => minimumScope.indexOf(scope) > -1).length !== 3
    ) {
      throw new UnauthorizedException(
        'JWT does not possess the required scope (`openid profile email`).',
      );
    }

    return payload;
  }
}
