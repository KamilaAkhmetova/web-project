import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseRegistration {
    private apiUrl = 'http://localhost:8000/api/schedules';

    constructor(private http: HttpClient) {}

    registerForLessons(lessonIds: number[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/register/`, { lessons: lessonIds });
    }
}