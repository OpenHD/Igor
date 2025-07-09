import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';

import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  beforeEach(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(AuthService);
    mockConfigService = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with no current user', () => {
    service.currentUser$.subscribe(user => {
      expect(user).toBeNull();
    });
  });
});
