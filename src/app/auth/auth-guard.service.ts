import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(
        private authService: AuthService,
        private route: Router
    ) { }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.authenticated()
            .pipe(
                tap((b) => {
                    if (!b) this.route.navigateByUrl('/auth/login');
                })
            );
    }
}
