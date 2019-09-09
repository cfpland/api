import { Category } from '../../../shared/types/category';

export interface AirtableCategoryDto {
  description: string;
  name: Category;
  providerId: string;
}
