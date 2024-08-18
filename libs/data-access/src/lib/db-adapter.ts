import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DBAdapter {
  private dbInstance: IDBDatabase | null = null;

  private get db() {
    if (!this.dbInstance) {
      throw new Error('DB is not initialized.');
    }
    return this.dbInstance;
  }

  public init() {
    return new Promise<void>((res, rej) => {
      const dbRequest = indexedDB.open('MyTestDatabase', 2);
      dbRequest.addEventListener('upgradeneeded', () => {
        dbRequest.result.createObjectStore('imports', {
          keyPath: 'id',
          autoIncrement: true,
        });
        dbRequest.result.createObjectStore('thumbnails', {
          keyPath: 'id',
          autoIncrement: true,
        });
      });
      dbRequest.addEventListener('success', () => {
        this.dbInstance = dbRequest.result;
        res();
      });
      dbRequest.addEventListener('error', () => {
        rej('Unable to open database.');
      });
    });
  }

  public getStore(collection: string, write: boolean) {
    return this.db
      .transaction([collection], write ? 'readwrite' : 'readonly')
      .objectStore(collection);
  }
}
