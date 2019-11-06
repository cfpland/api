import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LocationsService } from '../../data-access/locations/locations.service';
import { Location } from '../../data-access/locations/interfaces/location.interface';
import { Collection } from '../../data-access/interfaces/collection.interface';

@Controller('v0/locations')
export class LocationsController {
  constructor(
    private service: LocationsService,
  ) {}

  @Get()
  public get(@Query('search') search: string): Observable<Collection<Location>> {
    return this.service.getAll({search});
  }
}
