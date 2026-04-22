import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.html',
    styleUrls: ['./register.css']
})
export class RegisterComponent {
    userData = {
        username: '',
        email: '',
        password: '',
        password2: '',
        full_name: '',
        practice_group: ''
    };
    errorMessage = '';
    successMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    private formatError(errorBody: any): string {
        if (!errorBody) {
            return 'Registration failed. Please check your data.';
        }

        if (typeof errorBody === 'string') {
            return errorBody;
        }

        if (errorBody.detail) {
            return errorBody.detail;
        }

        if (errorBody.error) {
            return errorBody.error;
        }

        if (errorBody.non_field_errors) {
            return `Error: ${errorBody.non_field_errors.join(', ')}`;
        }

        const fieldErrors = Object.entries(errorBody)
            .map(([field, value]) => {
                if (Array.isArray(value)) {
                    return `${field}: ${value.join(', ')}`;
                }
                return `${field}: ${String(value)}`;
            })
            .join(' | ');

        return fieldErrors || 'Registration failed. Please check your data.';
    }

    onSubmit() {
        if (this.userData.password !== this.userData.password2) {
            this.errorMessage = 'Пароли не совпадают';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        this.authService.register(this.userData).subscribe({
            next: (response) => {
                this.successMessage = 'Регистрация успешна! Перенаправление на вход...';
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000);
            },
            error: (error) => {
                this.errorMessage = this.formatError(error.error);
                this.isLoading = false;
            }
        });
    }
}