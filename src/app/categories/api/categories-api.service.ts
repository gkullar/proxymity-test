import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Categories } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService {
  private http = inject(HttpClient);

  private readonly url = `${environment.api}/categories.php`;

  getAll(): Observable<Categories> {
    return this.http.get<Categories>(this.url);
  }
}
