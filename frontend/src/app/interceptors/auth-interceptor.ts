import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('access_token');
        const isAuthEndpoint =
            req.url.includes('/api/auth/login/') ||
            req.url.includes('/api/auth/register/') ||
            req.url.includes('/api/auth/token/refresh/');

        // Public auth endpoints should never receive stale access tokens.
        if (token && !isAuthEndpoint) {
            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}