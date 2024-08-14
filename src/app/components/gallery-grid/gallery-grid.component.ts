import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { GalleryService } from '../../services/gallery.service';
import { GalleryDialogComponent } from '../gallery-dialog/gallery-dialog.component';
import { GalleryItemComponent } from '../gallery-item/gallery-item.component';

@Component({
  selector: 'app-gallery-grid',
  standalone: true,
  imports: [GalleryItemComponent],
  templateUrl: './gallery-grid.component.html',
  styleUrl: './gallery-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryGridComponent {
  private dialog = inject(MatDialog);
  private galleryService = inject(GalleryService);
  private viewContainerRef = inject(ViewContainerRef);

  public activeItemId = toSignal(this.galleryService.activeItemId$);
  public items = toSignal(this.galleryService.items$, { initialValue: [] });

  setActive(id: string) {
    this.galleryService.setActiveItem(id);
  }

  openPhoto() {
    this.dialog.open(GalleryDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'dialog-fullscreen',
      viewContainerRef: this.viewContainerRef,
    });
  }
}
