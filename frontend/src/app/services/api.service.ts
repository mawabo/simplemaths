
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private auth = inject(Auth);

  constructor(private http: HttpClient) { }

  private request(method: string, endpoint: string, body: any = null): Observable<any> {
    // If not logged in, this will fail. AuthGuard ensures we are logged in.
    if (!this.auth.currentUser) {
         // Fallback or error
         throw new Error("User not authenticated");
    }

    return from(this.auth.currentUser.getIdToken()).pipe(
        switchMap(token => {
            const options = { headers: { Authorization: `Bearer ${token}` } };
            if (method === 'GET') return this.http.get(`${this.apiUrl}${endpoint}`, options);
            return this.http.post(`${this.apiUrl}${endpoint}`, body, options);
        })
    );
  }

  createCode(data: any): Observable<any> {
    return this.request('POST', '/admin/create-code', data);
  }

  getAccessCodes(): Observable<any[]> {
    return this.request('GET', '/dashboard/codes');
  }

  getWaitlist(): Observable<any[]> {
    return this.request('GET', '/dashboard/waitlist');
  }

  getSalesStats(): Observable<any[]> {
    return this.request('GET', '/dashboard/sales-stats');
  }

  requestEditAccess(): Observable<any> {
    return this.request('POST', '/auth/request-edit', {});
  }

  verifyEditAccess(key: string): Observable<any> {
    return this.request('POST', '/auth/verify-edit', { key });
  }
}
