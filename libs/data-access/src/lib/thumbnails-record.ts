import { Injectable } from '@angular/core';
import { BaseRecord } from './base-record';

export interface ThumbnailRecord {
  id: string;
  path: string;
  image: Blob;
  updatedAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class ThumbnailsRecordService extends BaseRecord<ThumbnailRecord> {
  protected collection = 'thumbnails';
}
