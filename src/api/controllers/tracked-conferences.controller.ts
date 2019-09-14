import {
  Body,
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
import { Collection } from '../../data-access/interfaces/collection.interface';
import { DeleteResult } from 'typeorm';
import { CreateTrackedConferenceParamDto } from '../../data-access/tracked-conferences/validation/create-tracked-conference-param.dto';
import { CreateTrackedConferenceBodyDto } from '../../data-access/tracked-conferences/validation/create-tracked-conference-body.dto';
import { TrackedConferencesService } from '../../data-access/tracked-conferences/tracked-conferences.service';

@Controller('v0/me/tracked-conferences')
export class TrackedConferencesController {
  constructor(private service: TrackedConferencesService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  public getMeTrackedConferences(
    @Req() request: RequestWithUser,
  ): Observable<Collection<UserConference>> {
    return this.service.getAll({ userId: request.user.id });
  }

  @Put(':atConferenceId')
  @UseGuards(AuthGuard('bearer'))
  public putMeConference(
    @Req() request: RequestWithUser,
    @Param() params: CreateTrackedConferenceParamDto,
    @Body() body: CreateTrackedConferenceBodyDto,
  ): Observable<UserConference> {
    return this.service.createOrUpdateOne({
      ...params,
      ...body,
      user: request.user,
    });
  }

  @Delete(':atConferenceId')
  @UseGuards(AuthGuard('bearer'))
  @HttpCode(204)
  public deleteMeConference(
    @Req() request: RequestWithUser,
    @Param() params: CreateTrackedConferenceParamDto,
  ): Observable<DeleteResult> {
    return this.service.deleteAll({
      ...params,
      userId: request.user.id,
    });
  }
}
