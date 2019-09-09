import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConferenceDto } from '../../data-access/conferences/dtos/conference.dto';
import { ConferencesService } from '../../data-access/conferences/services/conferences.service';
import { OptionalAuthGuard } from '../auth/optional-auth-guard';
import { RequestWithUser } from '../../shared/types/request-with-user.type';
import { ConferenceDatesInterceptor } from '../interceptors/conference-dates.interceptor';
import { ConferenceCacheInterceptor } from '../interceptors/conference-cache.interceptor';
import { ConferenceQueryParamsDto } from '../../data-access/conferences/validation/conference-query-params.dto';
import { User } from '../../data-access/users/entities/user.entity';
import { Collection } from '../../data-access/interfaces/collection.interface';

@Controller('v0/conferences')
export class ConferencesController {
  constructor(private conferencesService: ConferencesService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @UseInterceptors(ConferenceCacheInterceptor)
  @UseInterceptors(ConferenceDatesInterceptor)
  findAll(
    @Req() request: RequestWithUser,
    @Query() query: ConferenceQueryParamsDto,
  ): Promise<Collection<ConferenceDto>> {
    return this.conferencesService.getInternal(
      this.buildQueryForUser(request.user, query),
    );
  }

  private buildQueryForUser = (
    user: User | undefined,
    query: ConferenceQueryParamsDto,
  ): ConferenceQueryParamsDto =>
    user
      ? {
          ...query,
          atView: query.atView || 'closing_in_42',
        }
      : {
          atView: 'closing_in_21',
          category: query.category,
          region: query.region,
        };
}
