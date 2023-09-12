import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './auth/user';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'fireauth';

    authenticated$!: Observable<boolean>;
    user$!: Observable<User | null>;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        this.user$ = this.authService.getUser();
        this.authenticated$ = this.authService.authenticated();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/auth/login');
    }
}
