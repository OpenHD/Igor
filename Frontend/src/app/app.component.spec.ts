import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { EMPTY } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { ConfigService } from './services/config.service';
import { createSpyObj } from '../testing/create-spy-obj';

describe('AppComponent', () => {
  beforeEach(async () => {
    const routerSpy = createSpyObj<Router>('Router', ['navigate', 'createUrlTree', 'serializeUrl'], {
      events: EMPTY  // Add events as a property
    });
    const authServiceSpy = createSpyObj<AuthService>('AuthService', ['isAuthenticated', 'getCurrentUser']);
    const configServiceSpy = createSpyObj<ConfigService>('ConfigService', ['getConfig']);
    const activatedRouteSpy = createSpyObj<ActivatedRoute>('ActivatedRoute', ['snapshot']);

    // Configure router mocks
    routerSpy.createUrlTree.mockReturnValue({} as any);
    routerSpy.serializeUrl.mockReturnValue('/mock-url');

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'OpenHD-Management-Frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('OpenHD-Management-Frontend');
  });
});
