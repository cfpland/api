import { Collection } from '../../data-access/interfaces/collection.interface';

export const collect = <T>(items: T[], total?: number): Collection<T> => ({
  items,
  total: total ? total : items.length,
});
