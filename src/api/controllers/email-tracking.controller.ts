import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { EmailTrackingBody } from '../../data-access/email-tracking/interfaces/email-tracking-body.interface';
import { EmailTrackingService } from '../../data-access/email-tracking/email-tracking.service';
import { Observable } from 'rxjs';
import { EmailTracking } from '../../data-access/email-tracking/email-tracking.entity';

@Controller('v0/email-tracking')
export class EmailTrackingController {
  constructor(
    private service: EmailTrackingService,
  ) {}

  @Post()
  @HttpCode(204)
  public post(@Body() body: EmailTrackingBody[]): Observable<EmailTracking[]> {
    return this.service.createMany(body);
  }
}
