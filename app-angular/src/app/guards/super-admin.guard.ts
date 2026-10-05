import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

/**
 * Protege /admin/**: requiere sesión válida con role 'super_admin' (ver
 * backend/middleware/authMiddleware.js ROLES). Sin sesión manda a /login;
 * con sesión pero sin el rol, manda al home en vez de mostrar un 403 -no hay
 * página de "sin permisos" en el sitio y no vale la pena crear una para este caso.
 */
export const superAdminGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  const session = userService.sessionUser();
  if (!session || !userService.isTokenValid()) {
    return router.createUrlTree(['/login']);
  }
  if (session.user.role !== 'super_admin') {
    return router.createUrlTree(['/']);
  }
  return true;
};
