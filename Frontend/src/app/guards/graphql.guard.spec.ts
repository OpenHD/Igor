import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GraphqlGuard } from './graphql.guard';
import { AuthService } from '../services/auth.service';
import { createSpyObj, SpyObj } from '../../testing/create-spy-obj';

describe('GraphqlGuard', () => {
  let guard: GraphqlGuard;
  let mockAuthService: SpyObj<AuthService>;
  let mockRouter: SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = createSpyObj<AuthService>('AuthService', ['isAuthenticated']);
    const routerSpy = createSpyObj<Router>('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        GraphqlGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(GraphqlGuard);
    mockAuthService = TestBed.inject(AuthService) as unknown as SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as unknown as SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    
    const result = guard.canActivate();
    
    expect(result).toBe(true);
  });

  it('should redirect to login when user is not authenticated', () => {
    const mockUrlTree = {} as any;
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockRouter.parseUrl.mockReturnValue(mockUrlTree);
    
    const result = guard.canActivate();
    
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(mockUrlTree);
  });
});
