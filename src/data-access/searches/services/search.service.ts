import { Injectable } from '@nestjs/common';
import { DeleteResult, FindManyOptions, Repository } from 'typeorm';
import { Search } from '../entities/search.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map } from 'rxjs/operators';
import { collect } from '../../../shared/functions/collect';
import { Collection } from '../../interfaces/collection.interface';
import { GetAllSearchesOptions } from '../interfaces/get-all-searches-options.interface';
import {
  CreateDataService,
  DeleteOneDataService,
  GetAllDataService,
} from '../../interfaces/data-service.interface';

@Injectable()
export class SearchService
  implements
    GetAllDataService<Search>,
    CreateDataService<Search>,
    DeleteOneDataService<Search> {
  constructor(
    @InjectRepository(Search)
    private readonly searchRepository: Repository<Search>,
  ) {}

  public getAll(
    options: GetAllSearchesOptions,
  ): Observable<Collection<Search>> {
    const findManyOptions = this.getFindManyOptions(options);

    return fromPromise(this.searchRepository.find(findManyOptions)).pipe(
      map(searches => collect(searches)),
    );
  }

  public createOne(toCreate: Partial<Search>): Observable<Search> {
    const search = this.searchRepository.create(toCreate);

    return fromPromise(this.searchRepository.save(search)).pipe(
      map(s => {
        delete s.user;
        return s;
      }),
    );
  }

  public deleteOneById(id: string): Observable<DeleteResult> {
    return fromPromise(this.searchRepository.delete(id));
  }

  private getFindManyOptions(options?: GetAllSearchesOptions): FindManyOptions {
    if (options && options.userId !== undefined) {
      return { where: { user: options.userId } };
    }

    return {};
  }
}
