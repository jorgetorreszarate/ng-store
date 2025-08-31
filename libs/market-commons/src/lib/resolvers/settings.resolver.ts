import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { tap } from 'rxjs';
import { ConfigurationService } from '../http/configuration.service';
import { ISetting } from '../interfaces';
import { SettingsService } from '../services/settings.service';

export const SettingsResolver: ResolveFn<ISetting> = () => {
  const configurationService = inject(ConfigurationService);
  const settingsService = inject(SettingsService);

  return configurationService.getSettings()
    .pipe(
      tap((config: ISetting) => {
        // console.log('Settings app', config);
        settingsService.set(config);
      })
    );
};
