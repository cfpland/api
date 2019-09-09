import { GetOneDataService } from '../interfaces/data-service.interface';
import { MicrolinkClient } from './clients/microlink-client.service';
import { ConferenceEnhancements } from './interfaces/conference-enhancements.interface';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConferenceEnhancementsService
  implements GetOneDataService<ConferenceEnhancements> {
  private idField = 'url';

  constructor(private readonly microlinkClient: MicrolinkClient) {}

  public getOneBy(
    field: string,
    value: string,
  ): Observable<ConferenceEnhancements> {
    if (field !== this.idField) {
      throw new Error(
        `Conference enhancements require a field value "${this.idField}".`,
      );
    }
    return fromPromise(this.microlinkClient.getData(value));
  }

  public getOneById(value: string): Observable<ConferenceEnhancements> {
    return this.getOneBy(this.idField, value);
  }
}
