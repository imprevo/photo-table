import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GalleryService } from 'src/app/services/gallery.service';
import { GalleryItemComponent } from '../gallery-item/gallery-item.component';

@Component({
  selector: 'app-gallery-carousel',
  standalone: true,
  imports: [GalleryItemComponent],
  templateUrl: './gallery-carousel.component.html',
  styleUrl: './gallery-carousel.component.scss',
})
export class GalleryCarouselComponent {
  private galleryService = inject(GalleryService);

  public activeItemId = toSignal(this.galleryService.activeItemId$);
  public items = toSignal(this.galleryService.items$, { initialValue: [] });

  setActive(id: string) {
    this.galleryService.setActiveItem(id);
  }
}
