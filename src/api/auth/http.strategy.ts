import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate(token: string) {
    try {
      const user = await this.authService.verify(token);
      if (user) {
        return user;
      }
    } catch (e) {
      Logger.error(e.message);
    }

    throw new UnauthorizedException();
  }
}
