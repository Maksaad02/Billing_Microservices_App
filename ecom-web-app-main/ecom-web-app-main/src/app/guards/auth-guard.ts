import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, keycloak, grantedRoles } = authData;

  // 1. Force the user to log in if they are not authenticated.
  if (!authenticated) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url
    });
    return false;
  }

  // 2. Extract required roles from route data
  const requiredRoles = route.data['roles'];

  // Allow access if no specific roles are required
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
    return true;
  }

  // 3. Check if the user has the necessary roles (Realm Roles)
  const hasRequiredRole = requiredRoles.every((role) =>
    grantedRoles.realmRoles.includes(role)
  );

  if (hasRequiredRole) {
    return true;
  }

  // 4. Redirect if user is authenticated but not authorized
  const router = inject(Router);
  return router.parseUrl('/unauthorized');
};

export const authGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
