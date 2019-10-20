import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { fromPromise } from 'rxjs/internal-compatibility';
import * as queryString from 'querystring';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../config/config.service';

interface MoonclerkCustomerOptions {
  checkout_from?: string;
  checkout_to?: string;
  form_id?: string;
  status?: string;
}

@Injectable()
export class MoonclerkApiClientService {
  private baseUrl: string;
  private token: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get('MOONCLERK_BASE_URL');
    this.token = config.get('MOONCLERK_API_TOKEN');
  }

  public getCustomers = (
    options: MoonclerkCustomerOptions = {},
  ): Observable<any[]> => {
    const query = queryString.stringify(options);
    return fromPromise(
      fetch(`${this.baseUrl}/customers?${query}`, {
        headers: {
          Authorization: `Token token=${this.token}`,
          Accept: 'application/vnd.moonclerk+json;version=1',
        },
      })
        .then(res => res.json())
        .then(data => {
          return data && data.customers ? data.customers : [];
        }),
    );
  };
}
