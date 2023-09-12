import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User, UserForm } from '../user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    states: string[] = ['MG', 'RS', 'SC', 'SP', 'GO'];

    formRegister: FormGroup<UserForm> = this.fb.group<UserForm & { password2?: FormControl<string>; }>({
        firstname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        lastname: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        address: new FormControl('', { nonNullable: true }),
        city: new FormControl('', { nonNullable: true }),
        state: new FormControl('', { nonNullable: true }),
        phone: new FormControl('', { nonNullable: true }),
        mobilephone: new FormControl('', { nonNullable: true }),
        email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
        password2: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
    },
        // { validators: this.matchingPasswords('password', 'password2') }
        { validators: this.passwordMatchingValidatior }
    );

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
    ) { }

    ngOnInit() {

    }

    matchingPasswords(Password: string, ConfirmPassword: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[Password];
            const matchingControl = formGroup.controls[ConfirmPassword];
            if (
                matchingControl.errors &&
                !matchingControl.errors['confirmedValidator']
            ) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

    passwordMatchingValidatior(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('password2');

        return password?.value === confirmPassword?.value ? null : { notmatched: true };
    };

    onSubmit(): void {
        const userFormRequest: User = {
            firstname: this.formRegister.value.firstname!,
            lastname: this.formRegister.value.lastname!,
            address: this.formRegister.value.address!,
            city: this.formRegister.value.city!,
            state: this.formRegister.value.state!,
            phone: this.formRegister.value.phone!,
            mobilephone: this.formRegister.value.mobilephone!,
            email: this.formRegister.value.email!,
            password: this.formRegister.value.password
        };

        this.authService.register(userFormRequest)
            .subscribe({
                next: (u) => {
                    this.snackBar.open(
                        'Successfully registered. User your new credentials to sing in.', 'OK', { duration: 2000 }
                    );
                    this.router.navigateByUrl('/auth/login');
                },
                error: (err) => {
                    console.log(err);
                    this.snackBar.open(
                        'Error. You are not registered', 'OK', { duration: 2000 }
                    );
                }
            });
    }
}
