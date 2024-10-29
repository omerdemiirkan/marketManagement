import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core'; // importProvidersFrom'ı ekleyin
import { HttpClientModule } from '@angular/common/http'; // HttpClientModule'ü ekleyin

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule) // HttpClientModule'ü buraya ekleyin
  ]
};
