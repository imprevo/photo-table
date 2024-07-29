import { Route } from '@angular/router';
import { ImportPhotosComponent } from './components/import-photos/import-photos.component';
import { PhotosGridComponent } from './components/photos-grid/photos-grid.component';
import { ImportStartComponent } from './components/import-start/import-start.component';

export const appRoutes: Route[] = [
  {
    path: 'import',
    component: ImportPhotosComponent,
    children: [
      { path: '', component: ImportStartComponent },
      { path: ':id', component: PhotosGridComponent },
    ],
  },
  { path: '**', redirectTo: 'import' },
];
