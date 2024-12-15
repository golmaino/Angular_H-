import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Validators, FormBuilder } from '@angular/forms';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-data',
  standalone: true,  // standalone-Komponente
  imports: [SharedModule],  // Import der benötigten Module
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})


export class AddDataComponent implements OnInit {
  constructor(private formbuilder: FormBuilder, public storeService: StoreService, private backendService: BackendService,private snackBar: MatSnackBar) {
  }
  public registrationForm: any;

  
  ngOnInit(): void {
    this.registrationForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      courseId: ['', Validators.required],
      birthdate: [null, Validators.required],
      newsletter: [false]
    })
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.backendService.addRegistration(this.registrationForm.value, this.storeService.currentPage);
      this.snackBar.open('Kursanmeldung erfolgreich!', 'Schließen', {
        duration: 3000,
      });
  }
}
}
