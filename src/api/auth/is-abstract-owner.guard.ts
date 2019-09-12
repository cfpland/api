import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AbstractEntityService } from '../../data-access/abstracts/abstract-entity.service';

@Injectable()
export class IsAbstractOwner implements CanActivate {
  constructor(private readonly abstractService: AbstractEntityService) {}

  public canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.abstractService.getOneById(request.params.id).pipe(
      map(abstract => abstract.userId === request.user.id),
      catchError(e => of(false)),
    );
  }
}
