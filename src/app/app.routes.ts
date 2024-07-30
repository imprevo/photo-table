import { Route } from '@angular/router';
import { ImportPhotosComponent } from './components/import-photos/import-photos.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ImportStartComponent } from './components/import-start/import-start.component';

export const appRoutes: Route[] = [
  {
    path: 'import',
    component: ImportPhotosComponent,
    children: [
      { path: '', component: ImportStartComponent },
      // TODO: check if exists
      { path: ':id', component: GalleryComponent },
    ],
  },
  { path: '**', redirectTo: 'import' },
];
