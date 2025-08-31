import { Injectable, signal } from "@angular/core";
import { ISetting } from "@market/interfaces";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly settings = signal<ISetting>(null);

  set(value: ISetting): void {
    this.settings.set(value);
  }

  get(): ISetting {
    return this.settings();
  }
}