import { FormControl, FormGroup } from "@angular/forms";

export interface User {
    firstname: string;
    lastname: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    mobilephone: string;
    email: string;
    password?: string;
    id?: string;
}

export type UserForm = {
    [K in keyof User]: FormControl<User[K]>;
};