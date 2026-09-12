import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';
import { createSpyObj, SpyObj } from '../../testing/create-spy-obj';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: SpyObj<AuthService>;
  let mockRouter: SpyObj<Router>;
  let mockConfigService: SpyObj<ConfigService>;

  beforeEach(async () => {
    const authServiceSpy = createSpyObj<AuthService>('AuthService', ['login', 'isAuthenticated']);
    const routerSpy = createSpyObj<Router>('Router', ['navigate']);
    const configServiceSpy = createSpyObj<ConfigService>('ConfigService', ['getConfig']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as unknown as SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as unknown as SpyObj<Router>;
    mockConfigService = TestBed.inject(ConfigService) as unknown as SpyObj<ConfigService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
