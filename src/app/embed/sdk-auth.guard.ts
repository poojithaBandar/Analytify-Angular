import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const sdkAuthGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  let current = localStorage.getItem('currentUser');
  if (!current) {
    const token = route.queryParamMap.get('token');
    if (token) {
      localStorage.setItem('currentUser', JSON.stringify({ Token: token }));
      return true;
    }
    router.navigate(['authentication/login']);
    return false;
  }
  return true;
};
