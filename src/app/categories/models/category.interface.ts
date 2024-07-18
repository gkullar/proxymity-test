import { CategoryType } from './category-type.enum';

export interface Category {
  idCategory: string;
  strCategory: CategoryType;
  strCategoryThumb: string;
  strCategoryDescription: string;
}
