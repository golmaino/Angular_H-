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

  constructor(
    public storeService: StoreService,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    // Lade alle Kurse und Registrierungen für die Startseite
    this.backendService.getCourses(); // Lädt die Kursdaten
    this.backendService.getRegistrations(this.page); // Lädt Registrierungen für Seite 1
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
}
