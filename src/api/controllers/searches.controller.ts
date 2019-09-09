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
import { UserService } from '../../data-access/users/services/user.service';
import { Search } from '../../data-access/searches/entities/search.entity';
import { SearchService } from '../../data-access/searches/services/search.service';
import { CreateUserSearchDto } from '../../data-access/searches/validation/create-user-search.dto';
import { Collection } from '../../data-access/interfaces/collection.interface';
import { DeleteResult } from 'typeorm';

@Controller('v0/me/searches')
export class SearchesController {
  constructor(
    private userService: UserService,
    private searchService: SearchService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  public getMeSearches(
    @Req() request: RequestWithUser,
  ): Observable<Collection<Search>> {
    return this.searchService.getAll({ userId: request.user.id });
  }

  @Put()
  @UseGuards(AuthGuard('bearer'))
  public putMeSearch(
    @Req() request: RequestWithUser,
    @Body() body: CreateUserSearchDto,
  ): Observable<Search> {
    return this.searchService.createOne({ user: request.user, ...body });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('bearer'))
  public deleteMeSearch(
    @Req() request: RequestWithUser,
    @Param() params: { id: string },
  ): Observable<DeleteResult> {
    return this.searchService.deleteOneById(params.id);
  }
}
