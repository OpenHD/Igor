import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { vi } from 'vitest';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { createSpyObj, SpyObj } from '../../testing/create-spy-obj';

describe('AuthService', () => {
  let service: AuthService;
  let mockConfigService: SpyObj<ConfigService>;

  beforeEach(() => {
    const configServiceSpy = createSpyObj<ConfigService>('ConfigService', ['getConfig']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthService);
    mockConfigService = TestBed.inject(ConfigService) as unknown as SpyObj<ConfigService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return current user', () => {
    const testUser = { username: 'test', roles: ['USER'] };
    service['currentUserSubject'].next(testUser);
    
    expect(service.getCurrentUser()).toEqual(testUser);
  });

  it('should check authentication with valid token', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('valid-token');
    
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should check authentication with no token', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should logout and clear user', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    service['currentUserSubject'].next({ username: 'test', roles: ['USER'] });
    
    service.logout();
    
    expect(removeItemSpy).toHaveBeenCalledWith('auth_token');
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should get auth token from localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('test-token');
    
    expect(service.getAuthToken()).toBe('test-token');
  });

  it('should initialize with no current user', () => {
    service.currentUser$.subscribe(user => {
      expect(user).toBeNull();
    });
  });
});
