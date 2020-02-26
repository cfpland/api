import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Headers,
  UnauthorizedException,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, of } from 'rxjs';
import { User } from '../../data-access/users/entities/user.entity';
import { CreateUserDto } from '../../data-access/users/validation/create-user.dto';
import { mergeMap } from 'rxjs/operators';
import { UpdateUserDto } from '../../data-access/users/validation/update-user.dto';
import { RequestWithUser } from '../../shared/types/request-with-user.type';
import { UserService } from '../../data-access/users/services/user.service';
import { SearchService } from '../../data-access/searches/services/search.service';
import { ConfigService } from '../../config/config.service';
import { MoonclerkCustomer } from '../../data-access/users/clients/moonclerk-customer.interface';

@Controller('v0')
export class UsersController {
  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private config: ConfigService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard('bearer'))
  public getMe(@Req() request: RequestWithUser): Observable<User> {
    return of(request.user);
  }

  @Get('me/payment')
  @UseGuards(AuthGuard('bearer'))
  public getMePayment(@Req() request: RequestWithUser): Observable<MoonclerkCustomer> {
    return this.userService.getUserPaymentStatus(request.user);
  }

  @Patch('me')
  @UseGuards(AuthGuard('bearer'))
  public patchMe(
    @Req() request: RequestWithUser,
    @Body() userDto: UpdateUserDto,
  ): Observable<User> {
    return of(request.user).pipe(
      mergeMap<User, Observable<User>>((user: User) =>
        this.userService.saveUser({
          id: user.id,
          ...userDto,
        } as User),
      ),
    );
  }

  @Post('users')
  public createUser(
    @Body() userDto: CreateUserDto,
    @Headers('authorization') authToken?: string,
  ): Observable<User> {
    if (this.hasAuth0UserKey(authToken)) {
      return this.userService.createUser(userDto);
    } else {
      throw new UnauthorizedException();
    }
  }

  private hasAuth0UserKey = (authToken?: string) =>
    authToken &&
    this.config.get('AUTH0_CREATE_USER_KEY') &&
    authToken === `Bearer ${this.config.get('AUTH0_CREATE_USER_KEY')}`;
}
