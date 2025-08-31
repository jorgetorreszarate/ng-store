import { BsModalService, ConfirmService } from '@admin-core/services';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalService, YesnoPipe } from '@market-commons';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { PersonalRegisterComponent } from '../../components/personal-register/personal-register.component';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, YesnoPipe],
  providers: [PersonalService]
})
export class PersonalComponent implements OnInit {
  keywords: FormControl;
  users: any[];
  isLoading: boolean;

  private readonly bsModal = inject(BsModalService);
  private readonly confirmService = inject(ConfirmService);
  private readonly personalService = inject(PersonalService);

  constructor() {
    this.keywords = new FormControl('');
  }

  ngOnInit() {
    this.search();
  }

  search(): void {
    this.isLoading = true;
    this.personalService.search(this.keywords.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: res => {
          this.users = res;
        }
      });
  }

  async add(): Promise<void> {
    const res = await this.bsModal.open(PersonalRegisterComponent);
    if (res) {
      this.search();
    }
  }

  async edit(user: any): Promise<void> {
    const res = await this.bsModal.open(PersonalRegisterComponent, { user });
    if (res) {
      this.search();
    }
  }

  remove(user: any, index: number): void {
    this.confirmService.open('Eliminar', '¿Desea eliminar el personal?').then(res => {
      if (res) {
        this.personalService.remove(user.personalId)
          .subscribe({
            next: res => {
              if (res) {
                //this.users.splice(index, 1);
                user.flagActive = false;
                this.users = [...this.users];
              }
            },
            error: () => {
              Swal.fire('Eliminar', 'No se pudo eliminar el personal seleccionado', 'error');
            }
          });
      }
    });
  }

}
