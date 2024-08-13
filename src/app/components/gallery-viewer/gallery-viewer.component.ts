import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GalleryService } from 'src/app/services/gallery.service';

@Component({
  selector: 'app-gallery-viewer',
  standalone: true,
  imports: [],
  templateUrl: './gallery-viewer.component.html',
  styleUrl: './gallery-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryViewerComponent {
  private galleryService = inject(GalleryService);

  public activeItem = toSignal(this.galleryService.activeItem$);
}
