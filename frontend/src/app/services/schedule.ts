import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleItem } from '../models/schedule';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
    private apiUrl = 'http://localhost:8000/api/schedules';

    constructor(private http: HttpClient) {}

    getMySchedule(): Observable<ScheduleItem[]> {
        return this.http.get<ScheduleItem[]>(`${this.apiUrl}/my-schedule/`);
    }
}