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
import { UserConference } from './entities/user-conference.entity';
import { Collection } from '../interfaces/collection.interface';
import { collect } from '../../shared/functions/collect';
import { GetAllUserConferencesOptions } from './interfaces/get-all-user-conferences-options.interface';

@Injectable()
export class UserConferencesService
  implements
    GetAllDataService<UserConference>,
    DeleteAllDataService<UserConference> {
  constructor(
    @InjectRepository(UserConference)
    private readonly userConferencesRepository: Repository<UserConference>,
  ) {}

  public getAll(
    options: GetAllUserConferencesOptions,
  ): Observable<Collection<UserConference>> {
    const findManyOptions = this.getFindManyOptions(options);

    return fromPromise(
      this.userConferencesRepository.find(findManyOptions),
    ).pipe(map(userConferences => collect(userConferences)));
  }

  public createOrUpdateOne(
    toCreate: Partial<UserConference>,
  ): Observable<UserConference> {
    const userConference = this.userConferencesRepository.create(toCreate);

    return fromPromise(
      this.userConferencesRepository.save(userConference),
    ).pipe(
      map(uc => {
        delete uc.user;
        return uc;
      }),
    );
  }

  public deleteAll(
    options: GetAllUserConferencesOptions,
  ): Observable<DeleteResult> {
    const findManyOptions = this.getFindManyOptions(options);

    return fromPromise(
      this.userConferencesRepository.manager
        .createQueryBuilder()
        .delete()
        .from(UserConference)
        .where(findManyOptions.where)
        .execute(),
    );
  }

  private getFindManyOptions(
    options?: GetAllUserConferencesOptions,
  ): FindManyOptions {
    const where: ObjectLiteral = {};

    if (options) {
      if (options.userId !== undefined) {
        where.user = options.userId;
      }
      if (options.atConferenceId !== undefined) {
        where.atConferenceId = options.atConferenceId;
      }
    }

    return { where };
  }
}
