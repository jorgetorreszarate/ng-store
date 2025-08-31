import { NgModule, inject } from '@angular/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { esLocale } from 'ngx-bootstrap/locale';

defineLocale('es', { ...esLocale, week: { dow: 7 } }); // Definimos domingo como primer dia de la semana

function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    containerClass: 'theme-dark-blue',
    showWeekNumbers: false,
    dateInputFormat: 'DD/MM/YYYY',
    adaptivePosition: true,
    customTodayClass: 'custom-today',
    initCurrentTime: false
  });
}

@NgModule({
  imports: [
    BsDatepickerModule.forRoot(),
  ],
  exports: [BsDatepickerModule],
  providers: [
    BsLocaleService,
    {
      provide: BsDatepickerConfig,
      useFactory: getDatepickerConfig
    },
  ]
})
export class BsDatepickerConfigureModule {
  readonly bsLocaleService = inject(BsLocaleService);

  constructor() {
    this.bsLocaleService.use('es');
  }
}