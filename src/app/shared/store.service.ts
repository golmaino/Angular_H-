import { Injectable } from '@angular/core';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  public courses: Course[] = [];
  public registrations: Registration[] = [];
  public registrationTotalCount: number = 0;
  public filteredRegistrations: Registration[] = [];

  // Füge die `currentPage` hinzu
  public currentPage: number = 1; // Standardmäßig Seite 1
}
