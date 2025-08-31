import { Injectable, Type, inject } from '@angular/core';
import { DomService } from '@market-commons';
import { BehaviorSubject } from 'rxjs';
declare var bootstrap: any;

@Injectable({ providedIn: 'root' })
export class BsModalService {
  private _data = new BehaviorSubject<any>(null);
  private _modals = [];
  private domService = inject(DomService);

  // Si se necesita la instancia del componente en su origen
  /* create(component: any): ComponentRef<any> {
    return this.domService.createComponent(component);
  } */

  open(component: any, componentOpts?: any, modalOpts?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const $component: any = this.domService.createComponent(component, componentOpts);
      this.domService.attachComponent($component, document.body);

      // const domElem = document.getElementById('exampleModal');    
      const domElem = $component.location.nativeElement.querySelector('.modal');
      if (domElem) {
        const modal = new bootstrap.Modal(domElem, modalOpts);
        this._modals.push(modal);

        domElem.addEventListener('hidden.bs.modal', () => {
          const values = this._data.value;
          resolve(values);

          this._data.next(null);
          this._modals.pop();
          $component.destroy();
        });

        modal.show();
      } else {
        reject(`El componente ${this.getComponentName(component)} no tiene la estructura de un modal`);
      }
    });
  }

  private getComponentName(componentType: Type<any>): string {
    // Using the constructor name
    // Note: This might get minified in production, so be cautious in production builds
    return componentType.name || 'UnknownComponent';
  }

  close(value?: any): void {
    this._data.next(value);

    //Cerramos el último modal abierto
    const modal = this._modals[this._modals.length - 1];
    modal?.hide();
  }

}
