import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { graphqlGuard } from './graphql.guard';

describe('graphqlGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => graphqlGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
