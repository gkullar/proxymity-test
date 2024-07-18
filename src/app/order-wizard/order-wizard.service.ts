import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';

import { CategoriesApiService } from '../categories/api';
import { Category, CategoryType } from '../categories/models';
import { ProductsApiService } from '../products/api';
import { Product } from '../products/models';
import { createState } from '../utils/state';

@Injectable()
export class OrderWizardService {
  private readonly categoriesApi = inject(CategoriesApiService);

  private readonly productsApi = inject(ProductsApiService);

  readonly categories = createState<Category[]>([]);

  readonly products = createState<Product[]>([]);

  readonly selectedCategory = createState<CategoryType>();

  readonly order = {
    table: createState<number>(0),
    products: createState<Product[]>([]),
  };

  readonly fetchCategories = () =>
    this.categoriesApi
      .getAll()
      .pipe(tap((data) => this.categories.setState(data.categories)));

  readonly fetchProducts = (category: CategoryType) =>
    this.productsApi
      .getAll(category)
      .pipe(tap((data) => this.products.setState(data.meals)));
}
