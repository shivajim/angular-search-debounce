import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, Subject, switchMap } from 'rxjs';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  maidenName: string;
  gender: string;
  age: number;
}

interface Users {
  users: Partial<User>[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  input = new Subject<string>();
  usersList$: Observable<Partial<Users>>;

  constructor(private http: HttpClient) {
    this.usersList$ = this.input.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchVal) =>
        // Dummy API by default get all the data if search value is blank.
        // eg. use John it compare first name and last name.
        this.http
          .get(`https://dummyjson.com/users/search?q=${searchVal}`)
          .pipe(map((data: Partial<Users>) => data))
      )
    );
  }
  public onChange(event: KeyboardEvent) {
    this.input.next((event.target as HTMLInputElement).value);
  }
}
