import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../data-access/users/entities/user.entity';
import { UserService } from '../../data-access/users/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public verify(authToken: string): Promise<User | false> {
    const result = this.jwtService.verify(authToken);

    return result && result.sub && result.sub.length > 0
      ? this.userService.selectBy('auth0UserId', result.sub)
      : Promise.resolve(false);
  }
}
