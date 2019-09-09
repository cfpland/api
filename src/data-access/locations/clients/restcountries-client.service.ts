import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { Region } from '../../../shared/types/region';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class RestcountriesClientService {
  private baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get('RESTCOUNTRIES_BASE_URL');
  }

  public async getRegionByCountryCode(
    code: string,
  ): Promise<{ region?: Region; subregion?: string }> {
    let region = { region: undefined, subregion: undefined };

    try {
      const result = await this.getResults(`/alpha/${code}`);

      if (result) {
        region = {
          region: result.region,
          subregion: result.subregion,
        };
      }
    } catch (e) {
      Logger.error(e);
    }

    return region;
  }

  public getResults(endpoint: string): Promise<any> {
    return fetch(`${this.baseUrl}${endpoint}`).then(res => res.json());
  }
}
