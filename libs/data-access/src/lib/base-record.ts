import { inject } from '@angular/core';
import { DBAdapter } from './db-adapter';

export abstract class BaseRecord<DBRecord extends { id: string }> {
  private dbAdapter = inject(DBAdapter);

  protected abstract collection: string;

  public getAll() {
    const req = this.getStore().getAll();
    return new Promise<DBRecord[]>((res, rej) => {
      req.addEventListener('success', () => res(req.result));
      req.addEventListener('error', (error) => rej(error));
    });
  }

  public async add(record: Omit<DBRecord, 'id'>) {
    const req = this.getStore().add(record);
    return new Promise<string>((res, rej) => {
      req.addEventListener('success', () => res(req.result.toString()));
      req.addEventListener('error', (error) => rej(error));
    });
  }

  private getStore() {
    return this.dbAdapter.getStore(this.collection);
  }
}
