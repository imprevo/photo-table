import { inject, Injectable } from '@angular/core';
import { ThumbnailsRecordService } from '@photo-table/data-access';
import { ImageService } from './image.service';

const THUMBNAIL_SIZE = 256;

@Injectable({
  providedIn: 'root',
})
export class ThumbnailsService {
  private thumbnailsRecordService = inject(ThumbnailsRecordService);
  private imageService = inject(ImageService);

  public async getThumbnail(path: string, source: string) {
    const cache = await this.thumbnailsRecordService.getByKeyValue(
      'path',
      path
    );

    if (cache?.image) {
      return cache.image;
    }

    const thumbnail = await this.createThumbnail(source);
    await this.thumbnailsRecordService.add({
      path,
      image: thumbnail,
      updatedAt: Date.now(),
    });
    return thumbnail;
  }

  private createThumbnail(source: string) {
    return this.imageService.resize(source, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
  }
}
