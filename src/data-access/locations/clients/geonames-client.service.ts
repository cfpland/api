import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import * as queryString from 'querystring';
import { Country } from '../interfaces/country.interface';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class GeonamesClientService {
  private baseUrl: string;
  private username: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get('GEONAMES_BASE_URL');
    this.username = config.get('GEONAMES_USERNAME');
  }

  public async getCountry(search: string): Promise<Country> {
    let country = { name: undefined, code: undefined };

    try {
      const locations = await this.getResults(search);

      if (locations && locations.geonames && locations.geonames.length > 0) {
        country = {
          name: locations.geonames[0].countryName,
          code: locations.geonames[0].countryCode,
        };
      }
    } catch (e) {
      Logger.error(e);
    }

    return country;
  }

  private getResults(search: string): Promise<any> {
    const query = queryString.stringify({
      username: this.username,
      q: search,
    });

    return fetch(`${this.baseUrl}?${query}`).then(res => res.json());
  }
}
