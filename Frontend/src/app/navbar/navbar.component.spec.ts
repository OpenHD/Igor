import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { EMPTY } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../services/auth.service';
import { createSpyObj, SpyObj } from '../../testing/create-spy-obj';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: SpyObj<AuthService>;
  let mockRouter: SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = createSpyObj<AuthService>('AuthService', ['logout', 'isAuthenticated', 'getCurrentUser']);
    const routerSpy = createSpyObj<Router>('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: EMPTY  // Add events as a property
    });
    const activatedRouteSpy = createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot']);

    // Configure router mocks
    routerSpy.createUrlTree.mockReturnValue({} as any);
    routerSpy.serializeUrl.mockReturnValue('/mock-url');

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as unknown as SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as unknown as SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
