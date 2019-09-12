import { Options } from '../../interfaces/options.interface';
import { AbstractEntity } from '../abstract.entity';

export interface GetAllAbstractsOptions extends Options<AbstractEntity> {
  userId: string;
}
