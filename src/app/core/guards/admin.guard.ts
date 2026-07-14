import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TechnicalConfigService } from '../services/technical-config.service';

export const setupGuard: CanActivateFn = () => {
  const technicalConfig = inject(TechnicalConfigService);
  const router = inject(Router);
  if (technicalConfig.config().admin.urlToken) {
    return router.parseUrl('/');
  }
  return true;
};

export const tokenGuard: CanActivateFn = (route) => {
  const technicalConfig = inject(TechnicalConfigService);
  const router = inject(Router);
  const token = route.paramMap.get('token');
  const stored = technicalConfig.config().admin.urlToken;
  if (!stored || token !== stored) {
    return router.parseUrl('/');
  }
  return true;
};

export const sessionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.authenticated()) {
    const token = route.parent?.paramMap.get('token');
    return router.parseUrl(`/admin/${token}/login`);
  }
  return true;
};
