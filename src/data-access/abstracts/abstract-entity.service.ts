import { Injectable } from '@nestjs/common';
import {
  DeleteResult,
  FindManyOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { collect } from '../../shared/functions/collect';
import { Collection } from '../interfaces/collection.interface';
import {
  CreateDataService,
  DeleteOneDataService,
  GetAllDataService,
  GetOneDataService,
  UpdateDataService,
} from '../interfaces/data-service.interface';
import { AbstractEntity } from './abstract.entity';
import { GetAllAbstractsOptions } from './interfaces/get-all-searches-options.interface';

@Injectable()
export class AbstractEntityService
  implements
    GetAllDataService<AbstractEntity>,
    GetOneDataService<AbstractEntity>,
    CreateDataService<AbstractEntity>,
    UpdateDataService<AbstractEntity>,
    DeleteOneDataService<AbstractEntity> {
  constructor(
    @InjectRepository(AbstractEntity)
    private readonly repository: Repository<AbstractEntity>,
  ) {}

  public getAll(
    options: GetAllAbstractsOptions,
  ): Observable<Collection<AbstractEntity>> {
    const findManyOptions = this.getFindManyOptions(options);

    return fromPromise(this.repository.find(findManyOptions)).pipe(
      map(abstracts => collect(abstracts)),
    );
  }

  public getOneBy(
    field: string,
    value: string | number,
  ): Observable<AbstractEntity> {
    const where = {};
    where[field] = value;

    return fromPromise(this.repository.findOne({ where }));
  }

  public getOneById(id: string): Observable<AbstractEntity> {
    return this.getOneBy('id', id);
  }

  public createOne(
    toCreate: Partial<AbstractEntity>,
  ): Observable<AbstractEntity> {
    const search = this.repository.create(toCreate);

    return fromPromise(this.repository.save(search)).pipe(
      map(s => {
        delete s.user;
        return s;
      }),
    );
  }

  public updateOneById(
    id: string,
    toUpdate: Partial<AbstractEntity>,
  ): Observable<UpdateResult> {
    return fromPromise(this.repository.update(id, toUpdate));
  }

  public deleteOneById(id: string): Observable<DeleteResult> {
    return fromPromise(this.repository.delete(id));
  }

  private getFindManyOptions(
    options?: GetAllAbstractsOptions,
  ): FindManyOptions {
    if (options && options.userId !== undefined) {
      return { where: { userId: options.userId } };
    }

    return {};
  }
}
