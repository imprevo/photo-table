import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImportService } from 'src/app/services/import.service';

@Component({
  selector: 'app-photos-grid',
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: './photos-grid.component.html',
  styleUrl: './photos-grid.component.scss',
})
export class PhotosGridComponent {
  private route = inject(ActivatedRoute);
  private importService = inject(ImportService);

  private importId$ = this.route.params.pipe(map((params) => params['id']));
  private import$ = this.importId$.pipe(
    switchMap((id) => this.importService.getImportById(id))
  );

  public name = toSignal(this.import$.pipe(map((data) => data?.label)), {
    initialValue: '',
  });
}
