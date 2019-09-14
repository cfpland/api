import {
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
  Delete,
  Put, HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { RequestWithUser } from '../../shared/types/request-with-user.type';
import { UserConference } from '../../data-access/user-conferences/entities/user-conference.entity';
import { CreateUserConferenceParamDto } from '../../data-access/user-conferences/validation/create-user-conference-param.dto';
import { Collection } from '../../data-access/interfaces/collection.interface';
import { UserConferencesService } from '../../data-access/user-conferences/user-conferences.service';
import { DeleteResult } from 'typeorm';

@Controller('v0/me/saved-conferences')
export class SavedConferencesController {
  constructor(private service: UserConferencesService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  public getMeConferences(
    @Req() request: RequestWithUser,
  ): Observable<Collection<UserConference>> {
    return this.service.getAll({ userId: request.user.id });
  }

  @Put(':atConferenceId')
  @UseGuards(AuthGuard('bearer'))
  public putMeConference(
    @Req() request: RequestWithUser,
    @Param() params: CreateUserConferenceParamDto,
  ): Observable<UserConference> {
    return this.service.createOrUpdateOne({
      ...params,
      user: request.user,
    });
  }

  @Delete(':atConferenceId')
  @UseGuards(AuthGuard('bearer'))
  @HttpCode(204)
  public deleteMeConference(
    @Req() request: RequestWithUser,
    @Param() params: CreateUserConferenceParamDto,
  ): Observable<DeleteResult> {
    return this.service.deleteAll({
      ...params,
      userId: request.user.id,
    });
  }
}
