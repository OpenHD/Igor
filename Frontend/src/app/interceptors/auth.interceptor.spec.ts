import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { ConfigService } from '../services/config.service';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockConfigService: jasmine.SpyObj<ConfigService>;
  let mockHttpHandler: jasmine.SpyObj<HttpHandler>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', [], {
      apiBaseUrl: 'http://127.0.0.1:8080/api'
    });
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    mockConfigService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    mockHttpHandler = httpHandlerSpy;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add authorization header when token exists', () => {
    // Mock localStorage
    spyOn(Storage.prototype, 'getItem').and.returnValue('test-token');
    mockHttpHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    // Use API URL that starts with the configured apiBaseUrl
    const mockRequest = new HttpRequest('GET', 'http://127.0.0.1:8080/api/test');
    
    interceptor.intercept(mockRequest, mockHttpHandler);

    expect(mockHttpHandler.handle).toHaveBeenCalled();
    const calledWith = mockHttpHandler.handle.calls.mostRecent().args[0];
    expect(calledWith.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should not add authorization header when no token exists', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    mockHttpHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    // Use API URL that starts with the configured apiBaseUrl
    const mockRequest = new HttpRequest('GET', 'http://127.0.0.1:8080/api/test');
    
    interceptor.intercept(mockRequest, mockHttpHandler);

    expect(mockHttpHandler.handle).toHaveBeenCalled();
    const calledWith = mockHttpHandler.handle.calls.mostRecent().args[0];
    expect(calledWith.headers.get('Authorization')).toBeNull();
  });

  it('should logout and redirect on 401 error', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue('test-token');
    const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    mockHttpHandler.handle.and.returnValue(throwError(() => error));

    const mockRequest = new HttpRequest('GET', 'http://127.0.0.1:8080/api/test');
    
    interceptor.intercept(mockRequest, mockHttpHandler).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(mockAuthService.logout).toHaveBeenCalled();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      }
    });
  });

  it('should not logout on non-401 errors', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue('test-token');
    const error = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    mockHttpHandler.handle.and.returnValue(throwError(() => error));

    const mockRequest = new HttpRequest('GET', 'http://127.0.0.1:8080/api/test');
    
    interceptor.intercept(mockRequest, mockHttpHandler).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(mockAuthService.logout).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      }
    });
  });
});
