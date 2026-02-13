
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-container">
      <h2>Create Manual Access Code</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" class="form-control">
        </div>

        <div class="form-group">
          <label>Category</label>
          <select formControlName="appCategory" class="form-control">
            <option value="Life & Happiness">Life & Happiness</option>
            <option value="Livestock">Livestock</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Enterprise Funding">Enterprise Funding</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Wealth Management">Wealth Management</option>
          </select>
        </div>

        <div class="form-group">
          <label>Duration (Days)</label>
          <select formControlName="durationDays" class="form-control">
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
            <option value="365">365 Days</option>
          </select>
        </div>

        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Creating...' : 'Create Code' }}
        </button>

        <p *ngIf="message" [class.error]="isError">{{ message }}</p>
      </form>
    </div>
  `,
  styles: [`
    .create-container { max-width: 500px; margin: 2rem auto; padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    .form-control { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    button { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
    .error { color: red; }
  `]
})
export class CreateCodeComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    appCategory: ['Life & Happiness', Validators.required],
    durationDays: ['30', Validators.required]
  });

  loading = false;
  message = '';
  isError = false;

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.message = '';

    this.api.createCode(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = `Success! Code created: ${res.accessCode}`;
        this.isError = false;
        this.form.reset({ appCategory: 'Life & Happiness', durationDays: '30' });
      },
      error: (err) => {
        this.loading = false;
        this.message = 'Error creating code.';
        this.isError = true;
        console.error(err);
      }
    });
  }
}
