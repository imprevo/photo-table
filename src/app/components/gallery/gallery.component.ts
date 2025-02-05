import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, shareReplay, switchMap, tap } from 'rxjs';
import { GalleryService } from '../../services/gallery.service';
import { ImportService } from '../../services/import.service';
import { GalleryGridComponent } from '../gallery-grid/gallery-grid.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [GalleryGridComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  providers: [GalleryService],
})
export class GalleryComponent {
  private route = inject(ActivatedRoute);
  private importService = inject(ImportService);
  private galleryService = inject(GalleryService);

  private importId$ = this.route.params.pipe(
    map((params) => params['id']),
    // TODO: move to route level
    tap((importId) => this.galleryService.init(importId)),
    shareReplay(1)
  );
  private import$ = this.importId$.pipe(
    switchMap((id) => this.importService.getImportById(id))
  );

  public galleryName = toSignal(this.import$.pipe(map((data) => data?.label)), {
    initialValue: '',
  });
}
