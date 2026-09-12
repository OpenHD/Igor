import { TestBed } from '@angular/core/testing';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { HasRoleDirective } from './has-role.directive';
import { AuthService } from '../services/auth.service';
import { createSpyObj, SpyObj } from '../../testing/create-spy-obj';

describe('HasRoleDirective', () => {
  let directive: HasRoleDirective;
  let mockAuthService: SpyObj<AuthService>;
  let mockTemplateRef: SpyObj<TemplateRef<any>>;
  let mockViewContainerRef: SpyObj<ViewContainerRef>;

  beforeEach(() => {
    const authServiceSpy = createSpyObj<AuthService>('AuthService', ['hasRole']);
    const templateRefSpy = createSpyObj<TemplateRef<any>>('TemplateRef', ['createEmbeddedView']);
    const viewContainerRefSpy = createSpyObj<ViewContainerRef>('ViewContainerRef', ['createEmbeddedView', 'clear']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    mockAuthService = TestBed.inject(AuthService) as unknown as SpyObj<AuthService>;
    mockTemplateRef = templateRefSpy;
    mockViewContainerRef = viewContainerRefSpy;
    
    // Fix: Provide all required constructor arguments
    directive = new HasRoleDirective(
      mockTemplateRef as unknown as TemplateRef<any>,
      mockViewContainerRef as unknown as ViewContainerRef,
      mockAuthService as unknown as AuthService
    );
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should create embedded view when user has required role', () => {
    mockAuthService.hasRole.mockReturnValue(true);
    
    directive.appHasRole = ['admin'];
    
    expect(mockViewContainerRef.createEmbeddedView).toHaveBeenCalledWith(mockTemplateRef);
  });

  it('should clear view when user does not have required role', () => {
    mockAuthService.hasRole.mockReturnValue(false);
    
    directive.appHasRole = ['admin'];
    
    expect(mockViewContainerRef.clear).toHaveBeenCalled();
  });
});
