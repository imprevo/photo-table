/// <reference types="@types/wicg-file-system-access" />

import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, of } from 'rxjs';
import { DBAdapter } from './db-adapter';
import { Router } from '@angular/router';

export interface ImportBase {
  id: string;
  label: string;
  files: ImportedFile[];
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
  private dbAdapter = inject(DBAdapter);
  private router = inject(Router);

  private _imports$ = new BehaviorSubject<ImportBase[]>([]);

  private imports$ = this._imports$.asObservable();

  public getImportList() {
    return this.imports$;
  }

  public getImportById(id: string) {
    return this.imports$.pipe(
      map((imports) => imports.find((data) => data.id === id))
    );
  }

  public getImportFilesById(id: string) {
    return this.getImportById(id).pipe(map((data) => data?.files));
  }

  public async loadImports() {
    const records = this.dbAdapter.getStore('imports').getAll();

    records.addEventListener('success', async () => {
      if (!records.result.length) {
        return;
      }

      for await (const data of records.result) {
        this.getFiles(data.id.toString(), data.dirHandle);
      }
    });
  }

  public async openDirectory() {
    const dirHandle = await window.showDirectoryPicker();
    const req = this.dbAdapter.getStore('imports').add({
      name: dirHandle.name,
      dirHandle,
    });

    req.addEventListener('success', () => {
      const id = req.result.toString();
      this.getFiles(id, dirHandle);
      this.router.navigate(['/import', id]);
    });
  }

  private async getFiles(id: string, dirHandle: FileSystemDirectoryHandle) {
    const files: ImportedFile[] = [];

    for await (const [name, handle] of dirHandle.entries()) {
      const path = `${dirHandle.name}/${name}`;

      if (handle.kind === 'file') {
        const file = await handle.getFile();
        const source = (await this.getFileContent(file)) as string;
        files.push({ path, file, source });
      }
    }

    const importEntity: ImportBase = {
      id,
      label: dirHandle.name,
      files,
    };
    this._imports$.next([...this._imports$.value, importEntity]);
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
