import { GetOneDataService } from '../interfaces/data-service.interface';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { GeonamesClientService } from './clients/geonames-client.service';
import { RestcountriesClientService } from './clients/restcountries-client.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Location } from './interfaces/location.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationsService implements GetOneDataService<Location> {
  private idField = 'friendlyName';

  constructor(
    private readonly countryClient: GeonamesClientService,
    private readonly regionClient: RestcountriesClientService,
  ) {}

  public getOneBy(field: string, value: string): Observable<Location> {
    if (field !== this.idField) {
      throw new Error(`Location requires a field value "${this.idField}".`);
    }

    return fromPromise(this.countryClient.getCountry(value)).pipe(
      filter(
        country => country.code !== undefined && country.name !== undefined,
      ),
      mergeMap(country =>
        fromPromise(
          this.regionClient.getRegionByCountryCode(country.code),
        ).pipe(
          filter(region => region.region !== undefined),
          map(region => ({
            country,
            friendlyName: value,
            region: region.region,
            subregion: region.subregion,
          })),
        ),
      ),
    );
  }

  public getOneById(value: string): Observable<Location> {
    return this.getOneBy(this.idField, value);
  }
}
