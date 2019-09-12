import {
  Body,
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
  Delete,
  Put,
  Post,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { RequestWithUser } from '../../shared/types/request-with-user.type';
import { UserService } from '../../data-access/users/services/user.service';
import { Collection } from '../../data-access/interfaces/collection.interface';
import { AbstractEntityService } from '../../data-access/abstracts/abstract-entity.service';
import { AbstractEntity } from '../../data-access/abstracts/abstract.entity';
import { CreateUserAbstractDto } from '../../data-access/abstracts/validation/create-user-abstract.dto';
import { map } from 'rxjs/operators';
import { IsAbstractOwner } from '../auth/is-abstract-owner.guard';

@Controller('v0/me/abstracts')
export class AbstractsController {
  constructor(
    private userService: UserService,
    private abstractsService: AbstractEntityService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  public getMeAbstracts(
    @Req() request: RequestWithUser,
  ): Observable<Collection<AbstractEntity>> {
    return this.abstractsService.getAll({ userId: request.user.id });
  }

  @Post()
  @UseGuards(AuthGuard('bearer'))
  public postMeAbstract(
    @Req() request: RequestWithUser,
    @Body() body: CreateUserAbstractDto,
  ): Observable<AbstractEntity> {
    return this.abstractsService.createOne({
      userId: request.user.id,
      ...body,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('bearer'), IsAbstractOwner)
  @HttpCode(204)
  public putMeAbstract(
    @Req() request: RequestWithUser,
    @Param() params: { id: string },
    @Body() body: CreateUserAbstractDto,
  ): Observable<void> {
    return this.abstractsService
      .updateOneById(params.id, { ...body })
      .pipe(map(() => undefined));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'), IsAbstractOwner)
  @HttpCode(204)
  public deleteMeAbstract(
    @Req() request: RequestWithUser,
    @Param() params: { id: string },
  ): Observable<void> {
    return this.abstractsService
      .deleteOneById(params.id)
      .pipe(map(() => undefined));
  }
}
