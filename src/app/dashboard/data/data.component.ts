import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './data.component.html',
  styleUrl: './data.component.css'
})
export class DataComponent implements OnInit {
  public page: number = 1; // Startseite für Registrierungen
  public loadingId:string | null = null;
  public sortColumn: string = '';
  public sortDirection: 'asc' | 'desc' = 'asc';
  public filterText: string = '';

  constructor(
    public storeService: StoreService,
    private backendService: BackendService
  ) {}


  sortTable(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc'; // Standard aufsteigend
    }

    this.storeService.registrations.sort((a: any, b: any) => {
      const valueA = column === 'course.name' ? a.course.name : a[column];
      const valueB = column === 'course.name' ? b.course.name : b[column];

      if (column === 'registrationDate') {
        return this.sortDirection === 'asc'
          ? new Date(valueA).getTime() - new Date(valueB).getTime()
          : new Date(valueB).getTime() - new Date(valueA).getTime();
      }

      return this.sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }


  ngOnInit(): void {
    this.backendService.getCourses();
    this.backendService.getRegistrations(this.page);

    // Initialisiere die gefilterte Liste
    this.storeService.filteredRegistrations = this.storeService.registrations;
  }



  // Methode für Pagination: Ruft Registrierungen für die ausgewählte Seite ab
  selectPage(i: number): void {
    this.page = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(this.page);
  }

  // Berechnet die Gesamtzahl der Seiten basierend auf der Anzahl der Registrierungen
  public returnAllPages(): number[] {
    const pagesCount = Math.ceil(this.storeService.registrationTotalCount / 2); // Limit = 2
    const res = [];
    for (let i = 0; i < pagesCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  onCancelRegistration(registrationId: string): void {
    this.loadingId = registrationId; // Spinner aktivieren

    setTimeout(() => {
      this.backendService.deleteRegistration(registrationId, this.storeService.currentPage);
      this.loadingId = null;
    }, 3000);
  }

 /* filterTable(): void {
    this.storeService.filteredRegistrations = this.storeService.registrations.filter((registration) =>
      registration.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }*/

/*  filterAndSortTable(): void {
    let filteredData = this.storeService.registrations;

    // Filter anwenden
    if (this.filterText) {
      filteredData = filteredData.filter((registration) =>
        registration.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

    // Sortierung anwenden
    if (this.sortColumn) {
      filteredData.sort((a: any, b: any) => {
        const valueA = this.sortColumn === 'course.name' ? a.course.name : a[this.sortColumn];
        const valueB = this.sortColumn === 'course.name' ? b.course.name : b[this.sortColumn];
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    this.storeService.filteredRegistrations = filteredData;
  }*/

}
