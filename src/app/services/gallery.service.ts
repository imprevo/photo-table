import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';
import { ImportedFile, ImportService } from './import.service';
import { ImageService } from './image.service';

const THUMBNAIL_SIZE = 256;

interface GalleryItem {
  id: string;
  sourceUrl: string;
  thumbnailUrl: string;
}

@Injectable()
export class GalleryService {
  private importService = inject(ImportService);
  private imageService = inject(ImageService);

  private _activeItemId$ = new BehaviorSubject<string | null>(null);

  public items$ = this.importService.getImportFilesById().pipe(
    switchMap((res) =>
      Promise.all(res.map((data) => this.prepareImages(data)))
    ),
    shareReplay(1)
  );

  private async prepareImages(data: ImportedFile) {
    const thumbnail = await this.imageService.resize(
      data.source,
      THUMBNAIL_SIZE,
      THUMBNAIL_SIZE
    );
    return <GalleryItem>{
      id: data.path,
      sourceUrl: data.source,
      thumbnailUrl: URL.createObjectURL(thumbnail),
    };
  }

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
