import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, retry, timeout } from 'rxjs/operators';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
    user: User | null = null;
    isLoading = true;
    errorMessage = '';
    editMode = false;
    editData: any = {};

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        this.errorMessage = '';
        const cachedUser = this.authService.getCurrentUser();
        if (cachedUser) {
            this.user = cachedUser;
            this.isLoading = false;
        } else {
            this.isLoading = true;
        }

        this.authService.getProfile().pipe(
            timeout(10000),
            retry(1),
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe({
            next: (response: any) => {
                this.user = response.data;
                this.authService.setCurrentUser(this.user!);
            },
            error: (error: any) => {
                if (error.status === 401) {
                    this.router.navigate(['/login']);
                } else if (!this.user) {
                    this.errorMessage = 'Failed to load profile';
                }
            }
        });
    }

    toggleEditMode() {
        if (this.editMode) {
            this.cancelEdit();
            return;
        }

        this.editMode = true;
        this.editData = {
            full_name: this.user?.full_name || '',
            phone: this.user?.phone || '',
            practice_group: this.user?.practice_group || ''
        };
    }

    saveProfile() {
        this.errorMessage = '';
        this.authService.updateProfile(this.editData).subscribe({
            next: (response: any) => {
                this.user = response.data;
                this.authService.setCurrentUser(this.user!);
                this.editMode = false;
            },
            error: (error: any) => {
                this.errorMessage = 'Failed to update profile';
            }
        });
    }

    cancelEdit() {
        this.editMode = false;
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.authService.clearCurrentUser();
        this.router.navigate(['/login']);
    }
}