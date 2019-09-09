import { Options } from './options.interface';
import { Collection } from './collection.interface';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';

export interface CreateDataService<T> {
  createOne(toCreate: Partial<T>): Observable<T>;
}

export interface DeleteAllDataService<T> {
  deleteAll(options: Options<T>): Observable<DeleteResult>;
}

export interface DeleteOneDataService<T> {
  deleteOneById(id: string): Observable<DeleteResult>;
}

export interface GetAllDataService<T> {
  getAll(options: Options<T>): Observable<Collection<T>>;
}

export interface GetOneDataService<T> {
  getOneBy(field: string, value: string | number): Observable<T>;

  getOneById(id: string): Observable<T>;
}

export interface UpdateDataService<T> {
  updateOneById(id: string, toUpdate: Partial<T>): Observable<T>;
}

export interface DataService<T>
  extends CreateDataService<T>,
    DeleteOneDataService<T>,
    GetAllDataService<T>,
    GetOneDataService<T>,
    UpdateDataService<T> {}
