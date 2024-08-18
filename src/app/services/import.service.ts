import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { ImportRecordService } from '@photo-table/data-access';
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
  private importRecordService = inject(ImportRecordService);
  private fsAdapter = inject(FSAdapter);
  private router = inject(Router);

  private _imports$ = new BehaviorSubject<ImportBase[]>([]);

  private imports$ = this._imports$.asObservable();

  public getImportList() {
    return this.imports$;
  }

  public getImportById(id: string) {
    return this.imports$.pipe(
      map((imports) => imports.find((data) => data.id === id)),
      distinctUntilChanged()
    );
  }

  public getImportFilesById(id: string) {
    return this.getImportById(id).pipe(map((data) => data?.files));
  }

  public async loadImports() {
    try {
      const records = await this.importRecordService.getAll();
      for await (const data of records) {
        await this.getFiles(data.id.toString(), data.dirHandle);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public async openDirectory() {
    const dirHandle = await this.fsAdapter.openDirectory();
    const id = await this.importRecordService.add({
      name: dirHandle.name,
      dirHandle,
    });
    await this.getFiles(id, dirHandle);
    this.router.navigate(['/import', id]);
  }

  private async getFiles(id: string, dirHandle: FileSystemDirectoryHandle) {
    const files: ImportedFile[] = [];

    for await (const file of await this.fsAdapter.getFiles(dirHandle)) {
      const path = `${id}/${dirHandle.name}/${file.name}`;
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
        return this.getFileBlob(file);

      default:
        return null;
      // return file.text();
    }
  }

  private getFileBlob(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', () => resolve(reader.result));
      reader.addEventListener('error', (e) => reject(e));
      reader.readAsDataURL(file);
      // reader.readAsArrayBuffer(file);
    });
  }
}
