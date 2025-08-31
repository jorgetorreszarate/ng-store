import { BsDatepickerConfigureModule } from '@admin-core/config';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalService, SessionService, UserService } from '@market-commons';
import { UserModel } from '@market/models';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-general',
  templateUrl: './profile-general.component.html',
  styleUrl: './profile-general.component.scss',
  imports: [FormsModule, ReactiveFormsModule, BsDatepickerConfigureModule],
  providers: [PersonalService, UserService]
})
export class ProfileGeneralComponent implements OnInit {
  user: UserModel;
  form: FormGroup;
  isSave: boolean;
  isLoading: boolean;

  private readonly fb = inject(FormBuilder);
  private readonly session = inject(SessionService);
  private readonly personalService = inject(PersonalService);

  constructor() {
    this.build();
  }

  ngOnInit() {
    this.user = this.session.user;

    if (!this.user) {
      return;
    }

    this.isLoading = true;
    this.personalService.byID(this.user.personalId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          if (res) {
            if (res.FechaNacimiento) {
              res.FechaNacimiento = new Date(res.FechaNacimiento);
            }

            this.form.patchValue(res);
          }
        }
      });
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
      IdPersonalRegistro: null
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
}
