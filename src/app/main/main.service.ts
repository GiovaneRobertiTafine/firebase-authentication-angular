import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';
import { Person } from './person';

@Injectable({
    providedIn: 'root'
})
export class MainService {
    private peopleCollection$!: Observable<Person[]>;
    firestore: Firestore = inject(Firestore);

    constructor(
    ) {
        const itemCollection = collection(this.firestore, 'people');
        this.peopleCollection$ = collectionData(itemCollection, { idField: 'id' }) as Observable<Person[]>;
    }

    getPeople(): Observable<Person[]> {
        return this.peopleCollection$;
    }

    addPerson(p: Person): void {
        addDoc(collection(this.firestore, 'people'), p)
            .then((v) => {
            })
            .catch((err) => err);
    }

    delPerson(p: Person): void {
        const bookDocRef = doc(this.firestore, `people/${p.id}`);
        deleteDoc(bookDocRef)
            .then((v) => {
            })
            .catch((err) => err);
    }
}
