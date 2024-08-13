import { Injectable } from '@angular/core';
import { BaseRecord } from './base-record';

export interface ImportRecord {
  id: string;
  name: string;
  dirHandle: FileSystemDirectoryHandle;
}

@Injectable({
  providedIn: 'root',
})
export class ImportRecordService extends BaseRecord<ImportRecord> {
  protected collection = 'imports';
}
