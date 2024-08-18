import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';
import { ImportedFile, ImportService } from './import.service';
import { ThumbnailsService } from './thumbnails.service';

interface GalleryItem {
  id: string;
  sourceUrl: string;
  thumbnailUrl: string;
}

@Injectable()
export class GalleryService {
  private thumbnailsService = inject(ThumbnailsService);
  private importService = inject(ImportService);

  private _importId$ = new BehaviorSubject<string | null>(null);
  private _activeItemId$ = new BehaviorSubject<string | null>(null);

  public items$ = this._importId$.pipe(
    filter(Boolean),
    switchMap((id) => this.importService.getImportFilesById(id)),
    switchMap((files) =>
      files ? Promise.all(files.map((file) => this.prepareImages(file))) : []
    ),
    shareReplay(1)
  );

  private async prepareImages(data: ImportedFile) {
    const thumbnail = await this.thumbnailsService.getThumbnail(
      data.path,
      data.source
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

  public init(importId: string) {
    this._importId$.next(importId);
  }

  public setActiveItem(id: string) {
    this._activeItemId$.next(id);
  }
}
