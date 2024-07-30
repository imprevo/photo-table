import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GalleryViewerComponent } from '../gallery-viewer/gallery-viewer.component';
import { GalleryCarouselComponent } from '../gallery-carousel/gallery-carousel.component';

@Component({
  selector: 'app-gallery-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    GalleryViewerComponent,
    GalleryCarouselComponent,
  ],
  templateUrl: './gallery-dialog.component.html',
  styleUrl: './gallery-dialog.component.scss',
})
export class GalleryDialogComponent {}
