import { BsDatepickerConfigureModule } from '@admin-core/config';
import { loginInterceptor } from '@admin-core/interceptors';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEsPE from '@angular/common/locales/es-PE';
import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy, provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { AuthService, CryptoService, SessionService, loadingInterceptor, tokenInterceptor } from '@market-commons';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { TemplatePageTitleStrategy } from './core/services/title.service';

registerLocaleData(localeEsPE, 'es-PE');

export const appConfig: ApplicationConfig = {
  providers: [
    CryptoService,
    SessionService,
    AuthService,
    importProvidersFrom(
      BsDatepickerConfigureModule //Configuración para DatePicker
    ),
    provideRouter(
      routes,
      // this is in place of scrollPositionRestoration: 'enabled',
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
      // in place of  preloadingStrategy: PreloadService,
      // withPreloading(PreloadService),
      withHashLocation()
    ),
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy
    },
    provideAnimations(), // required animations providers
    provideToastr({
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      enableHtml: true
      // positionClass: 'toast-bottom-right',
    }),
    // provideHttpClient(),
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
        loadingInterceptor,
        loginInterceptor // Mostrar el login cuando vence sesion
      ])
    ),
    { provide: LOCALE_ID, useValue: 'es-PE' }
  ]
};
