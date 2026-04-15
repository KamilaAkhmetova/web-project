import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
    user: User | null = null;
    isLoading = true;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        this.authService.getProfile().subscribe({
            next: (response) => {
                this.user = response.data;
                this.authService.setCurrentUser(this.user!);
                this.isLoading = false;
            },
            error: (error) => {
                if (error.status === 401) {
                    this.router.navigate(['/login']);
                } else {
                    this.errorMessage = 'Ошибка загрузки профиля';
                }
                this.isLoading = false;
            }
        });
    }

    logout() {
        this.authService.logout().subscribe({
            next: () => {
                this.authService.clearCurrentUser();
                this.router.navigate(['/login']);
            }
        });
    }
}