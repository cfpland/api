import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../data-access/users/entities/user.entity';

@Injectable()
export class LocationPointInterceptor implements NestInterceptor<Response> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<User> {
    return next.handle().pipe(
      map(user => ({
        ...user,
        locationPoint: this.getLocationPointString(user),
      })),
    );
  }

  private getLocationPointString(user: User): string {
    return user.locationPoint.x + ',' + user.locationPoint.y;
  }
}
