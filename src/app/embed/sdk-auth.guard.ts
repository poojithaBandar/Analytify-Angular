import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RolespriviledgesService } from '../components/workbench/rolespriviledges.service';

export const sdkAuthGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const rolesService = inject(RolespriviledgesService);
  const tokenEndpoint = 'https://api.qa.insightapps.ai/v1';

  let current = localStorage.getItem('currentUser');
  if (!current || !localStorage.getItem('username')) {
    const token = route.queryParamMap.get('token');
    const userName = route.queryParamMap.get('appName');
    if (token) {
      localStorage.setItem('currentUser', JSON.stringify({ Token: token }));
      localStorage.setItem('username', JSON.stringify({userName:userName}));
      localStorage.setItem('isEmbedSDK', "true");
      // const landing = route.queryParamMap.get('route') || '/analytify/home';
      // return router.parseUrl(landing);
      try {
        const response = await fetch(tokenEndpoint+'/user_previleges_list'+'/'+token, {
          method: 'GET',
          headers: {  'Content-Type': 'application/json'  }
        });
        if (!response.ok) throw new Error('Failed to fetch privileges');
        const privileges = await response.json();
        rolesService.setRoleBasedPreviledges(privileges);

        const landing = route.queryParamMap.get('route') || '/analytify/home';
        return router.parseUrl(landing);
      } catch (err) {
        router.navigate(['authentication/login']);
        return false;
      }
         }
    router.navigate(['authentication/login']);
    return false;
  }
  localStorage.setItem('embedMode', 'true');
  return true;
};
