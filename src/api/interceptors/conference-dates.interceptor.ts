import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ConferenceDto } from '../../data-access/conferences/dtos/conference.dto';

export interface Response {
  items: ConferenceDto[];
  total: number;
}

@Injectable()
export class ConferenceDatesInterceptor implements NestInterceptor<Response> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    return next.handle().pipe(
      map(data => ({
        items: data.items.map(this.formatConference),
        total: data.total,
      })),
    );
  }

  private formatConference = (conference: ConferenceDto) => ({
    ...conference,
    cfp_due_date: moment(conference.cfp_due_date).format('YYYY-MM-DD'),
    cfp_start_date: moment(conference.cfp_start_date).format('YYYY-MM-DD'),
    event_end_date: moment(conference.event_end_date).format('YYYY-MM-DD'),
    event_start_date: moment(conference.event_start_date).format('YYYY-MM-DD'),
  });
}
