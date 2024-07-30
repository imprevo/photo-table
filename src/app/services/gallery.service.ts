import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  public urls$ = of([
    'https://placehold.co/256x256',
    'https://placehold.co/256x128',
    'https://placehold.co/128x256',
    'https://placehold.co/128x128',
    'https://placehold.co/256x256',
    'https://placehold.co/256x128',
    'https://placehold.co/128x256',
    'https://placehold.co/128x128',
  ]);
}
