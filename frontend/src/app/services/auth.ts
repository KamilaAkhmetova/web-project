import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://127.0.0.1:8000/api/auth';

    constructor(private http: HttpClient) {}

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register/`, userData);
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/login/`, { username, password });
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout/`, {});
    }

    getProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile/`);
    }

    updateProfile(userData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile/`, userData);
    }

    setCurrentUser(user: any): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser(): any {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    clearCurrentUser(): void {
        localStorage.removeItem('currentUser');
    }
}