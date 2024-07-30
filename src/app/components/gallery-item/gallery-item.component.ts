import { Component, input } from '@angular/core';

@Component({
  selector: 'app-gallery-item',
  standalone: true,
  imports: [],
  templateUrl: './gallery-item.component.html',
  styleUrl: './gallery-item.component.scss',
  host: {
    '[class.active]': 'isActive()',
  },
})
export class GalleryItemComponent {
  public url = input.required<string>();
  public isActive = input<boolean>(false);
}
