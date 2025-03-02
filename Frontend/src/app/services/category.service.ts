import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OsCategory} from '../models/osCategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8080/admin/images/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<OsCategory[]> {
    return this.http.get<OsCategory[]>(this.apiUrl);
  }
}
