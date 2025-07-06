import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to login with returnUrl when not authenticated', () => {
    localStorage.removeItem('currentUser');
    const result = executeGuard({} as any, { url: '/protected/url' } as any);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['authentication/login'], { queryParams: { returnUrl: '/protected/url' }});
  });
});
