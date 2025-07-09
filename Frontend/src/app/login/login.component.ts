import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials.username, this.credentials.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Login failed. Please check your credentials.';
          this.loading = false;
          console.error('Login error:', err);
        }
      });
  }
}
