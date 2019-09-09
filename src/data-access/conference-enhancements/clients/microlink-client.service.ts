import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as queryString from 'querystring';
import { ConferenceEnhancements } from '../interfaces/conference-enhancements.interface';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class MicrolinkClient {
  private baseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get('MICROLINK_BASE_URL');
  }

  public getData(url: string): Promise<ConferenceEnhancements> {
    const query = queryString.stringify({ url });

    return fetch(`${this.baseUrl}?${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const response = {
            description: data.data.description ? data.data.description : '-',
            icon: undefined,
          };

          if (
            data.data.logo &&
            data.data.logo.url &&
            data.data.logo.url.slice(-4) !== '.ico'
          ) {
            response.icon = data.data.logo.url;
          } else if (data.data.image && data.data.image.url) {
            response.icon = data.data.image.url;
          }

          return response;
        }
      });
  }
}
