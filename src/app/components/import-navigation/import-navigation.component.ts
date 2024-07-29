import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ImportService } from 'src/app/services/import.service';

@Component({
  selector: 'app-import-navigation',
  standalone: true,
  imports: [MatListModule, RouterModule, AsyncPipe],
  templateUrl: './import-navigation.component.html',
  styleUrl: './import-navigation.component.scss',
})
export class ImportNavigationComponent {
  private importService = inject(ImportService);

  public links = toSignal(this.importService.getImportList(), {
    initialValue: [],
  });
}
