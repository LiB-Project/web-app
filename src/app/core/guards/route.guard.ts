import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { UserStorageService } from '../services/user-storage.service';
import { Role } from '../model/role.enum';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {

  constructor(private userStorageService: UserStorageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.userStorageService.getUserAuthorization();
    if (currentUser) {

      if (route.data.roles &&
                this.rolesNotPermittedInRoute(route.data.roles, currentUser.roles)) {
            this.redirectUserToYourRoutePermmited(currentUser.roles);
            return false;
        }
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }

  private redirectUserToYourRoutePermmited(roles: Role[]): void {
    if (roles[0] === Role.ROLE_ADMIN) {
      this.router.navigate(['/admin']);
    } else if (roles[0] === Role.ROLE_SUPER_USER) {
      this.router.navigate(['/super']);
    }
  }
  private rolesNotPermittedInRoute(routeRoles: Role[], userRoles: Role[]): boolean {
    return userRoles.every((role) => routeRoles.indexOf(role) === -1) ;
  }
}
