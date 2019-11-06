import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import * as queryString from 'querystring';
import { GeonamesLocation } from '../interfaces/geonames-location.interface';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class GeonamesClientService {
  private baseUrl: string;
  private username: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get('GEONAMES_BASE_URL');
    this.username = config.get('GEONAMES_USERNAME');
  }

  public async getFirst(search: string): Promise<GeonamesLocation> {
    let geonamesLocation = {
      city: undefined,
      code: undefined,
      country: undefined,
      latitude: undefined,
      longitude: undefined,
    };

    try {
      const locations = await this.getResults(search);

      if (locations && locations.geonames && locations.geonames.length > 0) {
        geonamesLocation = {
          city: locations.geonames[0].name,
          code: locations.geonames[0].countryCode,
          country: locations.geonames[0].countryName,
          latitude: Number(locations.geonames[0].lat),
          longitude: Number(locations.geonames[0].lng),
        };
      }
    } catch (e) {
      Logger.error(e);
    }

    return geonamesLocation;
  }

  public async getSearch(search: string): Promise<GeonamesLocation[]> {
    const locations = [];

    try {
      const results = await this.getResults(search);

      if (results && results.geonames && results.geonames.length > 0) {
        results.geonames.map(location => {
          locations.push({
            city: location.name,
            code: location.countryCode,
            country: location.countryName,
            latitude: Number(location.lat),
            longitude: Number(location.lng),
            province: location.adminCode1,
          });
        });
      }
    } catch (e) {
      Logger.error(e);
    }

    return locations;
  }

  private getResults(search: string): Promise<any> {
    const query = queryString.stringify({
      cities: 'cities5000',
      username: this.username,
      q: search,
    });

    return fetch(`${this.baseUrl}?${query}`).then(res => res.json());
  }
}
