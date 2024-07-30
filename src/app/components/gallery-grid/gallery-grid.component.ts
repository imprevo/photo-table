import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { GalleryService } from 'src/app/services/gallery.service';
import { GalleryDialogComponent } from '../gallery-dialog/gallery-dialog.component';

@Component({
  selector: 'app-gallery-grid',
  standalone: true,
  imports: [],
  templateUrl: './gallery-grid.component.html',
  styleUrl: './gallery-grid.component.scss',
})
export class GalleryGridComponent {
  private dialog = inject(MatDialog);
  private galleryService = inject(GalleryService);

  public urls = toSignal(this.galleryService.urls$, { initialValue: [] });

  openPhoto() {
    this.dialog.open(GalleryDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'dialog-fullscreen',
    });
  }
}
