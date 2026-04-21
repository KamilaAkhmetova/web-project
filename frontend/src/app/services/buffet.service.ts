import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Buffet, BuffetDetail, ApiResponse, Food } from '../models/buffet.models';

@Injectable({
  providedIn: 'root'
})
export class BuffetService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // GET - список всех буфетов
  getBuffets(): Observable<ApiResponse<Buffet[]>> {
    return this.http.get<ApiResponse<Buffet[]>>(`${this.apiUrl}/buffets/`);
  }

  // GET - детали буфета (часы + меню)
  getBuffetDetail(id: number): Observable<ApiResponse<BuffetDetail>> {
    return this.http.get<ApiResponse<BuffetDetail>>(`${this.apiUrl}/buffets/${id}/detail/`);
  }

  // GET - поиск блюд
  searchFoods(query: string): Observable<{ data: Food[] }> {
    return this.http.get<{ data: Food[] }>(`${this.apiUrl}/foods/search/?q=${query}`);
  }
}