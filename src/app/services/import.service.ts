import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';

interface ImportBase {
  id: string;
  label: string;
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

  public getImportList() {
    return this.imports$;
  }

  public getImportById(id: string) {
    return this.imports$.pipe(
      map((imports) => imports.find((data) => data.id === id))
    );
  }
}
