import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Observable } from 'rxjs';
import { Person } from '../person';
import { faker } from '@faker-js/faker';

@Component({
    selector: 'app-people',
    templateUrl: './people.component.html',
    styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

    people$!: Observable<Person[]>;

    constructor(private mainService: MainService) { }

    ngOnInit() {
        this.people$ = this.mainService.getPeople();
    }

    addOne() {
        const p: Person = {
            name: faker.person.fullName(),
            age: faker.number.int({ max: 99, min: 18 }),
            email: faker.internet.email(),
            company: faker.company.name(),
            country: faker.location.country()
        };
        this.mainService.addPerson(p);
    }

    generate() {
        for (let index = 0; index < 5; index++) {
            this.addOne();
        }
    }

    del(p: Person): void {
        this.mainService.delPerson(p);
    }
}
