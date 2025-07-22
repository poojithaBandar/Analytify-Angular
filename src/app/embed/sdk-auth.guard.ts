import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const sdkAuthGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  let current = localStorage.getItem('currentUser');
  if (!current) {
    const token = route.queryParamMap.get('token');
    if (token) {
      localStorage.setItem('currentUser', JSON.stringify({ Token: token }));
      localStorage.setItem('userName', JSON.stringify({userName:"poojitha@stratapps.com"}));
      const landing = route.queryParamMap.get('route') || '/analytify/home';
      return router.parseUrl(landing);
         }
    router.navigate(['authentication/login']);
    return false;
  }
  return true;
};
