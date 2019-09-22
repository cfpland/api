import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { EmailTracking } from './email-tracking.entity';
import { EmailTrackingBody } from './interfaces/email-tracking-body.interface';
import * as moment from 'moment';

@Injectable()
export class EmailTrackingService {
  constructor(
    @InjectRepository(EmailTracking)
    private readonly repository: Repository<EmailTracking>,
  ) {}

  public createMany(
    toCreate: EmailTrackingBody[],
  ): Observable<EmailTracking[]> {
    const entities = toCreate.map(payload => this.repository.create({
      ...payload,
      timestamp: moment.unix(payload.timestamp),
      payload,
    }));

    return fromPromise(this.repository.save(entities));
  }
}
