import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { DBAdapter } from './db-adapter';
import { FSAdapter } from './fs-adapter';

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
  private fsAdapter = inject(FSAdapter);
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

    return new Promise<boolean>((res, rej) => {
      records.addEventListener('success', async () => {
        if (records.result.length) {
          for await (const data of records.result) {
            try {
              await this.getFiles(data.id.toString(), data.dirHandle);
            } catch (e) {
              rej(false);
            }
          }
        }
        res(true);
      });
      records.addEventListener('error', () => rej(false));
    }).catch(() => false);
  }

  public async openDirectory() {
    const dirHandle = await this.fsAdapter.openDirectory();
    const req = this.dbAdapter.getStore('imports').add({
      name: dirHandle.name,
      dirHandle,
    });

    req.addEventListener('success', async () => {
      const id = req.result.toString();
      await this.getFiles(id, dirHandle);
      this.router.navigate(['/import', id]);
    });
  }

  private async getFiles(id: string, dirHandle: FileSystemDirectoryHandle) {
    const files: ImportedFile[] = [];

    for await (const file of await this.fsAdapter.getFiles(dirHandle)) {
      const path = `${dirHandle.name}/${file.name}`;
      const source = (await this.getFileContent(file)) as string;
      files.push({ path, file, source });
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
