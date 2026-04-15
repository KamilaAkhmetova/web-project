import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.html',
    styleUrls: ['./login.css']
})
export class LoginComponent {
    username = '';
    password = '';
    errorMessage = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onSubmit() {
        if (!this.username || !this.password) {
            this.errorMessage = 'Введите username и пароль';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.username, this.password).subscribe({
            next: (response) => {
              console.log('Login response:', response);
              this.authService.setCurrentUser(response.user);
              this.router.navigate(['/profile']);
            },
            error: (error) => {
                this.errorMessage = error.error?.error || 'Ошибка входа. Проверьте данные.';
                this.isLoading = false;
            }
        });
    }
}