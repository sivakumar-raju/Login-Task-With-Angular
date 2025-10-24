import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';

import { AuthService, LoginRequest, LoginResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let cookieService: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    const cookieSpy = jasmine.createSpyObj('CookieService', ['get', 'set', 'delete']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: CookieService, useValue: cookieSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockCredentials: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse: LoginResponse = {
      token: 'mock-token',
      user: { email: 'test@example.com' }
    };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3001/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);

    expect(cookieService.set).toHaveBeenCalledWith('auth_token', 'mock-token', 1);
    expect(cookieService.set).toHaveBeenCalledWith('user_data', JSON.stringify(mockResponse.user), 1);
  });

  it('should logout and clear cookies', () => {
    service.logout();

    expect(cookieService.delete).toHaveBeenCalledWith('auth_token');
    expect(cookieService.delete).toHaveBeenCalledWith('user_data');
  });

  it('should check authentication status', () => {
    cookieService.get.and.returnValue('mock-token');
    
    const isAuthenticated = service.isAuthenticated();
    
    expect(isAuthenticated).toBe(true);
    expect(cookieService.get).toHaveBeenCalledWith('auth_token');
  });

  it('should return false when not authenticated', () => {
    cookieService.get.and.returnValue('');
    
    const isAuthenticated = service.isAuthenticated();
    
    expect(isAuthenticated).toBe(false);
  });

  it('should get user data from cookies', () => {
    const mockUser = { email: 'test@example.com' };
    cookieService.get.and.returnValue(JSON.stringify(mockUser));
    
    const user = service.getUser();
    
    expect(user).toEqual(mockUser);
    expect(cookieService.get).toHaveBeenCalledWith('user_data');
  });

  it('should return null when user data is invalid', () => {
    cookieService.get.and.returnValue('invalid-json');
    
    const user = service.getUser();
    
    expect(user).toBeNull();
  });
});
