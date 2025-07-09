import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { ConfigService } from '../services/config.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let mockConfigService: jasmine.SpyObj<ConfigService>;
  let mockHttpHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', [], {
      apiBaseUrl: 'http://127.0.0.1:8080/api'
    });
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    mockConfigService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    mockHttpHandler = httpHandlerSpy;
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
});
