import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GraphqlGuard } from './graphql.guard';
import { AuthService } from '../services/auth.service';

describe('GraphqlGuard', () => {
  let guard: GraphqlGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        GraphqlGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(GraphqlGuard);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    
    const result = guard.canActivate();
    
    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', () => {
    const mockUrlTree = {} as any;
    mockAuthService.isAuthenticated.and.returnValue(false);
    mockRouter.parseUrl.and.returnValue(mockUrlTree);
    
    const result = guard.canActivate();
    
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(mockUrlTree);
  });
});
