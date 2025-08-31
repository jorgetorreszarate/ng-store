import { ConfirmComponent } from "@admin-core/components/commons";
import { Injectable, inject } from "@angular/core";
import { BsModalService } from "./bs-modal.service";

export interface IConfirmOptions {
  confirmText: string;
  cancelText: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private bsModal = inject(BsModalService);

  open(title: string, message: string, opt?: IConfirmOptions): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const options: IConfirmOptions = {
        confirmText: 'Aceptar',
        cancelText: 'Cancelar',
        ...opt
      };

      this.bsModal.open(ConfirmComponent, { title, message, ...options }).then(res => {
        if (resolve === null) reject();
        else resolve(res);
      });
    });
  }

}
