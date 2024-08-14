import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ImportService } from '../../services/import.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-import-navigation',
  standalone: true,
  imports: [MatListModule, RouterModule, AsyncPipe, MatButtonModule],
  templateUrl: './import-navigation.component.html',
  styleUrl: './import-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportNavigationComponent implements OnInit {
  private importService = inject(ImportService);
  private cd = inject(ChangeDetectorRef);

  public showLoadBtn = false;

  public links = toSignal(this.importService.getImportList(), {
    initialValue: [],
  });

  public ngOnInit() {
    this.loadImports();
  }

  public async loadImports() {
    this.importService.loadImports().then((success) => {
      this.showLoadBtn = !success;
      this.cd.markForCheck();
    });
  }
}
