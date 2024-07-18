import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CategoryType } from '../../categories/models';
import { Products } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private http = inject(HttpClient);

  private readonly url = `${environment.api}/filter.php`;

  getAll(category: CategoryType): Observable<Products> {
    let params = new HttpParams().append('c', category);

    return this.http.get<Products>(this.url, { params }).pipe(
      map((products) => ({
        ...products,
        meals: products.meals.map((meal) => ({
          ...meal,
          price: this.getRandomPrice(),
        })),
      }))
    );
  }

  private getRandomPrice() {
    return parseFloat((Math.random() * 20).toFixed(2));
  }
}
