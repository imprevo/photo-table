import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { DBAdapter } from '@photo-table/data-access';
import { appRoutes } from './app.routes';
import { CustomReuseStrategy } from './services/route-reuse-strategy';

function initializeAppFactory(dbAdapter: DBAdapter) {
  return async () => {
    await dbAdapter.init();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [DBAdapter],
      useFactory: (dbAdapter: DBAdapter) => initializeAppFactory(dbAdapter),
    },
  ],
};
