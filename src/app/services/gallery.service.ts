import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, of } from 'rxjs';

interface GalleryItem {
  id: string;
  imageFull: string;
  imagePreview: string;
}

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private _activeItemId$ = new BehaviorSubject<string | null>(null);

  public items$ = of<GalleryItem[]>([
    {
      id: '1',
      imageFull: 'https://placehold.co/1080x1080',
      imagePreview: 'https://placehold.co/256x256',
    },
    {
      id: '2',
      imageFull: 'https://placehold.co/1080x512',
      imagePreview: 'https://placehold.co/256x128',
    },
    {
      id: '3',
      imageFull: 'https://placehold.co/512x1080',
      imagePreview: 'https://placehold.co/128x256',
    },
    {
      id: '4',
      imageFull: 'https://placehold.co/512x512',
      imagePreview: 'https://placehold.co/128x128',
    },
  ]);

  public activeItemId$ = this._activeItemId$.asObservable();

  public activeItem$ = combineLatest([this.items$, this.activeItemId$]).pipe(
    map(([items, activeItemId]) =>
      items.find((item) => item.id === activeItemId)
    )
  );

  public setActiveItem(id: string) {
    this._activeItemId$.next(id);
  }
}
