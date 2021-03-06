import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import {
  DeleteResult,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteAllDataService,
  GetAllDataService,
} from '../interfaces/data-service.interface';
import { Collection } from '../interfaces/collection.interface';
import { collect } from '../../shared/functions/collect';
import { TrackedConference } from './tracked-conference.entity';
import { GetAllTrackedConferencesOptions } from './interfaces/get-all-user-conferences-options.interface';

@Injectable()
export class TrackedConferencesService
  implements
    GetAllDataService<TrackedConference>,
    DeleteAllDataService<TrackedConference> {
  constructor(
    @InjectRepository(TrackedConference)
    private readonly repository: Repository<TrackedConference>,
  ) {}

  public getAll(
    options: GetAllTrackedConferencesOptions,
  ): Observable<Collection<TrackedConference>> {
    const findManyOptions = this.getFindManyOptions({
      ...options,
      relations: ['abstracts'],
    });

    return fromPromise(
      this.repository.find(findManyOptions),
    ).pipe(map(userConferences => collect(userConferences)));
  }

  public createOrUpdateOne(
    toCreate: Partial<TrackedConference>,
  ): Observable<TrackedConference> {
    const userConference = this.repository.create(toCreate);

    return fromPromise(
      this.repository.save(userConference),
    ).pipe(
      map(uc => {
        delete uc.user;
        return uc;
      }),
    );
  }

  public deleteAll(
    options: GetAllTrackedConferencesOptions,
  ): Observable<DeleteResult> {
    const findManyOptions = this.getFindManyOptions(options);

    return fromPromise(
      this.repository.manager
        .createQueryBuilder()
        .delete()
        .from(TrackedConference)
        .where(findManyOptions.where)
        .execute(),
    );
  }

  private getFindManyOptions(
    options?: GetAllTrackedConferencesOptions,
  ): FindManyOptions {
    const where: ObjectLiteral = {};
    let relations: string[] = [];

    if (options) {
      if (options.userId !== undefined) {
        where.user = options.userId;
      }
      if (options.atConferenceId !== undefined) {
        where.atConferenceId = options.atConferenceId;
      }
      if (options.relations && options.relations.length >= 1) {
        relations = options.relations;
      }
    }

    return { where, relations };
  }
}
