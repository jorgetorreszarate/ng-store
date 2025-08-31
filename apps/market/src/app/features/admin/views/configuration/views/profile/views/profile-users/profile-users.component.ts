import { BsDatepickerConfigureModule } from '@admin-core/config';
import { BsModalService, ConfirmService } from '@admin-core/services';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalService, SessionService, UserService } from '@market-commons';
import { UserModel } from '@market/models';
import Swal from 'sweetalert2';
import { UserEditComponent } from '../../../../components';

@Component({
  selector: 'app-profile-users',
  templateUrl: './profile-users.component.html',
  styleUrls: ['./profile-users.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, BsDatepickerConfigureModule],
  providers: [PersonalService, UserService]
})
export class ProfileUsersComponent implements OnInit {
  user: UserModel;
  form: FormGroup;
  isSave: boolean;
  isLoading: boolean;

  private readonly fb = inject(FormBuilder);
  private readonly bsModal = inject(BsModalService);
  private readonly confirmService = inject(ConfirmService);
  private readonly session = inject(SessionService);
  private readonly personalService = inject(PersonalService);
  private readonly userService = inject(UserService);

  constructor() {
    this.build();
  }

  ngOnInit() {
    this.user = this.session.user;

    if (this.user) {
      this.isLoading = true;
      this.personalService.byID(this.user.personalId).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res) {
            if (res.FechaNacimiento) {
              res.FechaNacimiento = new Date(res.FechaNacimiento);
            }

            this.form.patchValue(res);
          }
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  build(): void {
    this.form = this.fb.group({
      IdPersonal: null,
      IdEmpresa: [null, Validators.required],
      Nombres: [null, Validators.required],
      ApePaterno: [null, Validators.required],
      ApeMaterno: [null, Validators.required],
      IdTipoDocumento: [1, Validators.required],
      NroDocumento: [null, Validators.required],
      Genero: null,
      FechaNacimiento: null,
      Celular: null,
      Email: [null, Validators.email],
      Direccion: null,
      FlagActivo: true,
      FechaRegistro: new Date(),
      IdPersonalRegistro: null,
      Usuarios: this.fb.control([])
    });
  }

  title(str: string) {
    return str.toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase());
  }

  save(): void {
    if (this.form.valid) {
      this.isSave = true;

      const values = this.form.value;
      values.Nombres = this.title(values.Nombres);
      values.ApePaterno = this.title(values.ApePaterno);
      values.ApeMaterno = this.title(values.ApeMaterno);
      values.Email = values.Email?.toLowerCase();

      this.isLoading = true;

      this.personalService.register(values).subscribe({
        next: id => {
          this.isLoading = false;
          this.form.get('IdPersonal').setValue(id);

          Swal.fire('Listo', 'Los datos han sido registrados exitosamente', 'success');
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  accept(): void {
    const values = this.form.value;
    this.bsModal.close(this.isSave ? values : null);
  }

  clear(): void {
    this.form.reset({
      FlagActivo: true,
      FechaRegistro: new Date(),
      Usuarios: []
    });
  }

  addUser(): void {
    const user = { IdPersonal: this.form.get('IdPersonal').value };
    this.bsModal.open(UserEditComponent, { user }).then(res => {
      if (res) {
        this.form.get('Usuarios').value.push(res);
        Swal.fire('Listo', 'Los datos han sido registrados exitosamente', 'success');
      }
    });
  }

  editUser(user: any, index: number) {
    this.bsModal.open(UserEditComponent, { user }).then(res => {
      if (res) {
        this.form.get('Usuarios').value.splice(index, 1, res);
        Swal.fire('Listo', 'Se ha modificado el usuario', 'success');
      }
    });
  }

  removeUser(item: any, index: number): void {
    this.confirmService.open('Eliminar', '¿Desea eliminar el usuario?').then(res => {
      if (res) {
        this.userService.remove(item.IdUsuario).subscribe(success => {
          if (success) {
            this.form.get('Usuarios').value.splice(index, 1);
          } else {
            Swal.fire('Atención', 'No se puede eliminar el usuario', 'error');
          }
        });
      }
    });
  }

}
