import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc, getDoc, collectionData } from '@angular/fire/firestore';
import {
    Auth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendEmailVerification,
    User,
    authState,
    UserCredential,

} from '@angular/fire/auth';
import { User as UserFront } from './user';
import { Observable, catchError, from, map, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // private userCollection: AngularFirestoreCollection<User> = this.afs.collection('users');
    UserData!: User;
    firestore: Firestore = inject(Firestore);
    constructor(
        private auth: Auth
    ) {
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.UserData = user;
                localStorage.setItem('user', JSON.stringify(this.UserData));
                JSON.parse(localStorage.getItem('user')!);
            } else {
                localStorage.setItem('user', 'null');
                JSON.parse(localStorage.getItem('user')!);
            }
        });
    }

    register(user: UserFront): Observable<boolean> {
        return from(createUserWithEmailAndPassword(this.auth, user.email!, user.password!))
            .pipe(
                switchMap(async (u) => {
                    delete user.password;
                    this.UserData = u.user;
                    delete user.password;
                    await setDoc(doc(collection(this.firestore, 'users'), u.user.uid), user);
                    this.logout();
                    return true;
                }),
                catchError((err) => throwError(() => err))
            );
        // createUserWithEmailAndPassword(this.auth, user.email!, user.password!)
        // .then((result) => {
        //   this.UserData = result.user;
        // })
        // .catch((error) => {
        //   window.alert(error.message);
        // });
        // return from(this.afAuth.createUserWithEmailAndPassword(user.email, user.password!))

    }

    login(email: string, password: string): Observable<UserFront> {
        return from(signInWithEmailAndPassword(this.auth, email, password))
            .pipe(
                switchMap(async (u) => {
                    this.UserData = u.user;
                    const docSnap = (await getDoc(doc(this.firestore, `users`, u.user.uid))).data()!;
                    return docSnap as UserFront;

                }),
                catchError(() => throwError(() => "Invalid credentials or user is not registered."))
            );
        //   .then((result: any) => {
        //     this.UserData = result.user;

        //   })
        //   .catch((error) => {
        //     window.alert(error.message);
        //   });
        // return from(this.afAuth.signInWithEmailAndPassword(email, password))
        //     .pipe(
        //         switchMap((u) =>
        //             this.userCollection.doc<User>(u.user?.uid).valueChanges() as Observable<User>
        //         ),
        //         catchError(() => throwError(() => "Invalid credentials or user is not registered."))
        //     );
    }

    logout(): void {
        signOut(this.auth).then(() => { });
        // this.afAuth.signOut();
    }

    getUser(): Observable<UserFront | null> {
        return authState(this.auth)
            .pipe(
                switchMap(async (u) => (u) ? (await getDoc(doc(this.firestore, `users`, u.uid))).data()! as UserFront : null)
            );
    }

    authenticated(): Observable<boolean> {
        return authState(this.auth)
            .pipe(
                map((u) => (u) ? true : false)
            );
    }

    async updateUserData(u: UserCredential) {
        try {
            const newUser: UserFront = {
                firstname: u.user.displayName!,
                lastname: '',
                address: '',
                city: '',
                state: '',
                phone: '',
                mobilephone: '',
                email: u.user.email!,
                id: u.user.uid
            };

            await setDoc(doc(collection(this.firestore, 'users'), u.user.uid), newUser);
            return newUser;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async loginWithGoogleAccount() {
        try {
            const provider = new GoogleAuthProvider();
            let credentials: UserCredential = await signInWithPopup(this.auth, provider);
            let user: UserFront = await this.updateUserData(credentials);
            return user;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    loginGoogle(): Observable<UserFront> {
        return from(this.loginWithGoogleAccount());
    }

    oldLoginGoogle(): Observable<UserFront> {
        const provider = new GoogleAuthProvider();
        return from(signInWithPopup(this.auth, provider))
            .pipe(
                tap(data => console.log(data)),
                switchMap((u: UserCredential) => {
                    const newUser: UserFront = {
                        firstname: u.user.displayName!,
                        lastname: '',
                        address: '',
                        city: '',
                        state: '',
                        phone: '',
                        mobilephone: '',
                        email: u.user.email!,
                        id: u.user.uid
                    };
                    return setDoc(doc(collection(this.firestore, 'users'), u.user.uid), newUser).then((u) => newUser);
                })
            );
    }
}
