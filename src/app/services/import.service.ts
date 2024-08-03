/// <reference types="@types/wicg-file-system-access" />

import { Injectable } from '@angular/core';
import { BehaviorSubject, map, of } from 'rxjs';

export interface ImportBase {
  id: string;
  label: string;
}

export interface ImportedFile {
  path: string;
  file: File;
  source: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private imports$ = of<ImportBase[]>([
    { id: '1', label: '2021' },
    { id: '2', label: '2022' },
    { id: '3', label: '2023' },
    { id: '4', label: '2024' },
  ]);

  private files$ = new BehaviorSubject<ImportedFile[]>([]);

  public getImportList() {
    return this.imports$;
  }

  public getImportById(id: string) {
    return this.imports$.pipe(
      map((imports) => imports.find((data) => data.id === id))
    );
  }

  public getImportFilesById() {
    // TODO: get by id
    return this.files$.asObservable();
  }

  public openDirectory() {
    this.getDirectory();
  }

  private async getDirectory() {
    const dirHandle = await window.showDirectoryPicker();
    const files: ImportedFile[] = [];

    for await (const [name, handle] of dirHandle.entries()) {
      const path = `${dirHandle.name}/${name}`;

      if (handle.kind === 'file') {
        const file = await handle.getFile();
        const source = (await this.getFileContent(file)) as string;
        files.push({ path, file, source });
      }
    }

    console.log('files', files);
    this.files$.next(files);
  }

  private async getFileContent(file: File) {
    switch (file.type) {
      case 'image/png':
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/gif':
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener('loadend', () => resolve(reader.result));
          reader.addEventListener('error', (e) => reject(e));
          reader.readAsDataURL(file);
          // reader.readAsArrayBuffer(file);
        });

      default:
        return null;
      // return file.text();
    }
  }
}
