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
import { SavedConference } from '../../data-access/saved-conferences/entities/saved-conference.entity';
import { CreateSavedConferenceParamDto } from '../../data-access/saved-conferences/validation/create-saved-conference-param.dto';
import { Collection } from '../../data-access/interfaces/collection.interface';
import { SavedConferencesService } from '../../data-access/saved-conferences/saved-conferences.service';
import { DeleteResult } from 'typeorm';

@Controller('v0/me/saved-conferences')
export class SavedConferencesController {
  constructor(private service: SavedConferencesService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  public getMeConferences(
    @Req() request: RequestWithUser,
  ): Observable<Collection<SavedConference>> {
    return this.service.getAll({ userId: request.user.id });
  }

  @Put(':atConferenceId')
  @UseGuards(AuthGuard('bearer'))
  public putMeConference(
    @Req() request: RequestWithUser,
    @Param() params: CreateSavedConferenceParamDto,
  ): Observable<SavedConference> {
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
    @Param() params: CreateSavedConferenceParamDto,
  ): Observable<DeleteResult> {
    return this.service.deleteAll({
      ...params,
      userId: request.user.id,
    });
  }
}
