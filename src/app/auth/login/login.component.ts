import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loading = false;

    loginForm: FormGroup = this.fb.group({
        'email': ['', [Validators.required, Validators.email]],
        'password': ['', [Validators.required, Validators.minLength(6)]]
    });

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {

    }

    private loginOkNotification(u: User) {
        this.snackBar.open(
            'Logged in successfuly. Welcome ' + u.firstname + '!',
            'OK',
            { duration: 2000 }
        );
    }

    private loginErrorNotification(err: any) {
        this.snackBar.open(
            err,
            'OK',
            { duration: 2000 }
        );
    }

    ngOnInit() {

    }

    onSubmit() {
        this.loading = true;
        this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
            .subscribe({
                next: (u) => {
                    this.loginOkNotification(u);
                    this.router.navigateByUrl('/');
                    this.loading = false;
                },
                error: (err) => {
                    this.loginErrorNotification(err);
                    this.loading = false;

                }
            });
    }

    loginGoogle() {
        this.loading = true;
        this.authService.loginGoogle()
            .subscribe({
                next: (u) => {
                    this.loginOkNotification(u);
                    this.router.navigateByUrl('/');
                    this.loading = false;
                },
                error: (err) => {
                    this.loginErrorNotification(err);
                    this.loading = false;
                }
            });
    }
}
