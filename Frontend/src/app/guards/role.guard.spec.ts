import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { createSpyObj, SpyObj } from '../../testing/create-spy-obj';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let mockAuthService: SpyObj<AuthService>;
  let mockRouter: SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = createSpyObj<AuthService>('AuthService', ['hasRole', 'isAuthenticated']);
    const routerSpy = createSpyObj<Router>('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    mockAuthService = TestBed.inject(AuthService) as unknown as SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as unknown as SpyObj<Router>;
    
    mockRoute = {
      data: { roles: ['admin'] },
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      outlet: 'primary',
      component: null,
      routeConfig: null,
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: {} as any,
      queryParamMap: {} as any,
      title: undefined
    } as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user has required role', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.hasRole.mockReturnValue(true);
    
    const result = guard.canActivate(mockRoute, mockState);
    
    expect(result).toBe(true);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockAuthService.hasRole).toHaveBeenCalledWith(['admin']);
  });

  it('should redirect to login when user does not have required role', () => {
    const mockUrlTree = {} as any;
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.hasRole.mockReturnValue(false);
    mockRouter.parseUrl.mockReturnValue(mockUrlTree);
    
    const result = guard.canActivate(mockRoute, mockState);
    
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(mockUrlTree);
  });

  it('should redirect to login when user is not authenticated', () => {
    const mockUrlTree = {} as any;
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockRouter.parseUrl.mockReturnValue(mockUrlTree);
    
    const result = guard.canActivate(mockRoute, mockState);
    
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockAuthService.hasRole).not.toHaveBeenCalled();
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(mockUrlTree);
  });
});
