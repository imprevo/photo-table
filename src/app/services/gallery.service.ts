import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, of } from 'rxjs';

interface GalleryItem {
  id: string;
  sourceUrl: string;
  thumbnailUrl: string;
}

@Injectable()
export class GalleryService {
  private _activeItemId$ = new BehaviorSubject<string | null>(null);

  public items$ = of<GalleryItem[]>([
    {
      id: '1',
      sourceUrl: 'https://placehold.co/1080x1080',
      thumbnailUrl: 'https://placehold.co/256x256?text=1',
    },
    {
      id: '2',
      sourceUrl: 'https://placehold.co/1080x512',
      thumbnailUrl: 'https://placehold.co/256x128?text=2',
    },
    {
      id: '3',
      sourceUrl: 'https://placehold.co/512x1080',
      thumbnailUrl: 'https://placehold.co/128x256?text=3',
    },
    {
      id: '4',
      sourceUrl: 'https://placehold.co/512x512',
      thumbnailUrl: 'https://placehold.co/128x128?text=4',
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
