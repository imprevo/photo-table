import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ImportService } from 'src/app/services/import.service';
import { ImportNavigationComponent } from '../import-navigation/import-navigation.component';

@Component({
  selector: 'app-import-photos',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    ImportNavigationComponent,
  ],
  templateUrl: './import-photos.component.html',
  styleUrl: './import-photos.component.scss',
})
export class ImportPhotosComponent implements OnInit {
  private importService = inject(ImportService);

  public ngOnInit() {
    this.importService.loadImports();
  }

  public importFiles() {
    this.importService.openDirectory();
  }
}
