import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected isLoggedIn = signal(false);
  protected isMenuOpen = signal(false);  

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    this.isLoggedIn.set(!!token);
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}