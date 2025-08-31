import { BsModalService } from '@admin-core/services';
import { Component, HostListener, Input, inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  standalone: true
})
export class ConfirmComponent {
  /** Este componente es un modal llamado en tiempo de ejecución por 
   * bsModalService, las variables de entrada (inputs) no son necesarias
   **/
  @Input() title: string = 'Confirmar';
  @Input() message: string;
  @Input() confirmText: string = 'Aceptar';
  @Input() cancelText: string = 'Cancelar';

  private readonly bsModal = inject(BsModalService);

  confirm(type: boolean): void {
    this.bsModal.close(type);
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: any) {
    if (event.key === 'Enter') {
      this.confirm(true);
    }
  }

}
