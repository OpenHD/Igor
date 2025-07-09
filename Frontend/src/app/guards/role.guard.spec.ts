import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole', 'isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
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
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.hasRole.and.returnValue(true);
    
    const result = guard.canActivate(mockRoute, mockState);
    
    expect(result).toBe(true);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockAuthService.hasRole).toHaveBeenCalledWith(['admin']);
  });

  it('should redirect to login when user does not have required role', () => {
    const mockUrlTree = {} as any;
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.hasRole.and.returnValue(false);
    mockRouter.parseUrl.and.returnValue(mockUrlTree);
    
    const result = guard.canActivate(mockRoute, mockState);
    
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(mockUrlTree);
  });

  it('should redirect to login when user is not authenticated', () => {
    const mockUrlTree = {} as any;
    mockAuthService.isAuthenticated.and.returnValue(false);
    mockRouter.parseUrl.and.returnValue(mockUrlTree);
    
    const result = guard.canActivate(mockRoute, mockState);
    
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockAuthService.hasRole).not.toHaveBeenCalled();
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(mockUrlTree);
  });
});
