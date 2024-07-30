import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ImportService } from 'src/app/services/import.service';
import { GalleryGridComponent } from '../gallery-grid/gallery-grid.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [GalleryGridComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  private route = inject(ActivatedRoute);
  private importService = inject(ImportService);

  private importId$ = this.route.params.pipe(map((params) => params['id']));
  private import$ = this.importId$.pipe(
    switchMap((id) => this.importService.getImportById(id))
  );

  public galleryName = toSignal(this.import$.pipe(map((data) => data?.label)), {
    initialValue: '',
  });
}
