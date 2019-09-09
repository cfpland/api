import {
  Body,
  Controller,
  Get,
  Req,
  UseGuards,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { RequestWithUser } from '../../shared/types/request-with-user.type';
import { UserConference } from '../../data-access/user-conferences/entities/user-conference.entity';
import { CreateUserConferenceParamDto } from '../../data-access/user-conferences/validation/create-user-conference-param.dto';
import { CreateUserConferenceBodyDto } from '../../data-access/user-conferences/validation/create-user-conference-body.dto';
import { Collection } from '../../data-access/interfaces/collection.interface';
import { UserConferencesService } from '../../data-access/user-conferences/user-conferences.service';
import { DeleteResult } from 'typeorm';

@Controller('v0/me/conferences')
export class UserConferencesController {
  constructor(private userConferencesService: UserConferencesService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  public getMeConferences(
    @Req() request: RequestWithUser,
  ): Observable<Collection<UserConference>> {
    return this.userConferencesService.getAll({ userId: request.user.id });
  }

  @Put(':atConferenceId/:action')
  @UseGuards(AuthGuard('bearer'))
  public putMeConference(
    @Req() request: RequestWithUser,
    @Param() params: CreateUserConferenceParamDto,
    @Body() body: CreateUserConferenceBodyDto,
  ): Observable<UserConference> {
    return this.userConferencesService.createOne({
      ...params,
      ...body,
      user: request.user,
    });
  }

  @Delete(':atConferenceId/:action')
  @UseGuards(AuthGuard('bearer'))
  public deleteMeConference(
    @Req() request: RequestWithUser,
    @Param() params: CreateUserConferenceParamDto,
  ): Observable<DeleteResult> {
    return this.userConferencesService.deleteAll({
      ...params,
      userId: request.user.id,
    });
  }
}
