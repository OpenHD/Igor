import { TestBed } from '@angular/core/testing';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { HasRoleDirective } from './has-role.directive';
import { AuthService } from '../services/auth.service';

describe('HasRoleDirective', () => {
  let directive: HasRoleDirective;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTemplateRef: jasmine.SpyObj<TemplateRef<any>>;
  let mockViewContainerRef: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole']);
    const templateRefSpy = jasmine.createSpyObj('TemplateRef', ['createEmbeddedView']);
    const viewContainerRefSpy = jasmine.createSpyObj('ViewContainerRef', ['createEmbeddedView', 'clear']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockTemplateRef = templateRefSpy;
    mockViewContainerRef = viewContainerRefSpy;
    
    // Fix: Provide all required constructor arguments
    directive = new HasRoleDirective(mockTemplateRef, mockViewContainerRef, mockAuthService);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should create embedded view when user has required role', () => {
    mockAuthService.hasRole.and.returnValue(true);
    
    directive.appHasRole = ['admin'];
    
    expect(mockViewContainerRef.createEmbeddedView).toHaveBeenCalledWith(mockTemplateRef);
  });

  it('should clear view when user does not have required role', () => {
    mockAuthService.hasRole.and.returnValue(false);
    
    directive.appHasRole = ['admin'];
    
    expect(mockViewContainerRef.clear).toHaveBeenCalled();
  });
});
