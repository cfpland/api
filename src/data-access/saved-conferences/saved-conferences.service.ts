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
import { SavedConference } from './entities/saved-conference.entity';
import { Collection } from '../interfaces/collection.interface';
import { collect } from '../../shared/functions/collect';
import { GetAllSavedConferencesOptions } from './interfaces/get-all-saved-conferences-options.interface';

@Injectable()
export class SavedConferencesService
  implements
    GetAllDataService<SavedConference>,
    DeleteAllDataService<SavedConference> {
  constructor(
    @InjectRepository(SavedConference)
    private readonly userConferencesRepository: Repository<SavedConference>,
  ) {}

  public getAll(
    options: GetAllSavedConferencesOptions,
  ): Observable<Collection<SavedConference>> {
    const findManyOptions = this.getFindManyOptions(options);

    return fromPromise(
      this.userConferencesRepository.find(findManyOptions),
    ).pipe(map(userConferences => collect(userConferences)));
  }

  public createOrUpdateOne(
    toCreate: Partial<SavedConference>,
  ): Observable<SavedConference> {
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
    options: GetAllSavedConferencesOptions,
  ): Observable<DeleteResult> {
    const findManyOptions = this.getFindManyOptions(options);

    return fromPromise(
      this.userConferencesRepository.manager
        .createQueryBuilder()
        .delete()
        .from(SavedConference)
        .where(findManyOptions.where)
        .execute(),
    );
  }

  private getFindManyOptions(
    options?: GetAllSavedConferencesOptions,
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
