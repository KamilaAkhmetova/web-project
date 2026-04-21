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
        faculty: ''
    };
    errorMessage = '';
    successMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

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
                if (error.error?.password) {
                    this.errorMessage = 'Пароль: ' + error.error.password.join(', ');
                } else if (error.error?.username) {
                    this.errorMessage = 'Username: ' + error.error.username.join(', ');
                } else if (error.error?.email) {
                    this.errorMessage = 'Email: ' + error.error.email.join(', ');
                } else {
                    this.errorMessage = 'Ошибка регистрации. Проверьте данные.';
                }
                this.isLoading = false;
            }
        });
    }
}