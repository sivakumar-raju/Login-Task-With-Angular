import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly API_BASE_URL = 'http://localhost:3001/api';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    // Check if user is already authenticated on service initialization
    this.checkAuthenticationStatus();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthData(response.token, response.user);
        })
      );
  }

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY);
    this.cookieService.delete(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    const token = this.cookieService.get(this.TOKEN_KEY);
    return !!token;
  }

  getToken(): string {
    return this.cookieService.get(this.TOKEN_KEY);
  }

  getUser(): User | null {
    const userData = this.cookieService.get(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  private setAuthData(token: string, user: User): void {
    // Set token with 24 hour expiration
    this.cookieService.set(this.TOKEN_KEY, token, 1);
    // Set user data with 24 hour expiration
    this.cookieService.set(this.USER_KEY, JSON.stringify(user), 1);
    this.isAuthenticatedSubject.next(true);
  }

  private checkAuthenticationStatus(): void {
    const isAuth = this.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuth);
  }
}
