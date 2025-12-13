
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CreateCodeComponent } from '../create-code/create-code.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CreateCodeComponent],
  template: `
    <div class="dashboard">
      <header>
        <h1>Access Code Handler</h1>
        <button (click)="logout()">Logout</button>
      </header>
      <main>
        <app-create-code></app-create-code>
        <!-- In a real app, we would list codes here -->
      </main>
    </div>
  `,
  styles: [`
    header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #f8f9fa; border-bottom: 1px solid #ddd; }
    main { padding: 2rem; }
    button { padding: 0.5rem 1rem; border: 1px solid #ddd; background: white; cursor: pointer; }
  `]
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout().then(() => this.router.navigate(['/login']));
  }
}
