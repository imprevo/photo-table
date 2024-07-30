import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { GalleryService } from 'src/app/services/gallery.service';

@Component({
  selector: 'app-gallery-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-carousel.component.html',
  styleUrl: './gallery-carousel.component.scss',
})
export class GalleryCarouselComponent {
  private galleryService = inject(GalleryService);

  public urls = toSignal(this.galleryService.urls$, { initialValue: [] });
}
