import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient,
    private storeService: StoreService,
    private snackBar: MatSnackBar
  ) {}

  public getCourses() {
    this.http.get<Course[]>('http://localhost:5000/courses?_expand=eventLocation').subscribe(data => {
      this.storeService.courses = data;
    });
  }

  public getRegistrations(page: number) {

    const options = {
      observe: 'response' as const,
      transferCache: {
        includeHeaders: ['X-Total-Count']
      }
    };

    this.http.get<Registration[]>(`http://localhost:5000/registrations?_expand=course&_page=${page}&_limit=4`, options).subscribe(data => {
      this.storeService.registrations = data.body!;
      this.storeService.filteredRegistrations = [...data.body!]; // Aktualisiere die gefilterte Liste
      this.storeService.registrationTotalCount = Number(data.headers.get('X-Total-Count'));
    });
  }

  public addRegistration(registration: any, page: number) {
    this.http.post('http://localhost:5000/registrations', registration).subscribe(
      (_) => {
        this.getRegistrations(page);
        this.snackBar.open('Registrierung erfolgreich hinzugefügt!', 'Schließen', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open('Fehler bei der Registrierung.', 'Schließen', {
          duration: 3000,
        });
      }
    );
  }

  public deleteRegistration(registrationId: string, page: number): void {
    this.http.delete(`http://localhost:5000/registrations/${registrationId}`).subscribe(
      () => {
        this.getRegistrations(page);
        this.snackBar.open('Registrierung erfolgreich gelöscht!', 'Schließen', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open('Fehler beim Löschen der Registrierung.', 'Schließen', {
          duration: 3000,
        });
      }
    );
  }
}
