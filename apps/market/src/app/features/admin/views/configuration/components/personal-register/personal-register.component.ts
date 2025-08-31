import { BsDatepickerConfigureModule } from '@admin-core/config';
import { BsModalService, ConfirmService } from '@admin-core/services';
import { NgClass } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService, PersonalService, SessionService, UserService } from '@market-commons';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, finalize, merge } from 'rxjs';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-personal-register',
  templateUrl: './personal-register.component.html',
  styleUrls: ['./personal-register.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, NgClass, BsDatepickerConfigureModule],
  providers: [
    PersonalService,
    UserService,
    CompanyService
  ]
})
export class PersonalRegisterComponent implements OnInit {
  @Input() user: any;
  activeTab: 'general' | 'users' = 'general';
  form: FormGroup;
  companies: any[];
  isSave: boolean;
  isLoading: boolean;
  isLoadingCompanies: boolean;

  private readonly fb = inject(FormBuilder);
  private readonly bsModal = inject(BsModalService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastr = inject(ToastrService);
  private readonly sessionService = inject(SessionService);
  private readonly configurationService = inject(CompanyService);
  private readonly personalService = inject(PersonalService);
  private readonly userService = inject(UserService);

  constructor() {
    this.build();
  }

  ngOnInit() {
    this.loadCompanies();

    if (this.user) {
      this.load();
    }
  }

  loadCompanies(): void {
    this.isLoadingCompanies = true;
    this.configurationService.companies()
      .pipe(finalize(() => this.isLoadingCompanies = false))
      .subscribe({
        next: res => {
          this.companies = res;
        }
      });
  }

  load(): void {
    this.isLoading = true;
    combineLatest([
      this.userService.usersByPersonal(this.user.personalId),
      this.personalService.byID(this.user.personalId)
    ])
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: ([users, personal]: [any[], any]) => {
          if (personal) {
            if (personal.birthDate) {
              personal.birthDate = new Date(personal.birthDate);
            }

            this.form.patchValue(personal);
          }

          if (users) {
            this.form.get('users').setValue(users);
          }
        }
      });
  }

  build(): void {
    this.form = this.fb.group({
      personalId: 0,
      companyId: [null, Validators.required],
      name: [null, Validators.required],
      fatherLastName: [null, Validators.required],
      motherLastName: [null, Validators.required],
      documentTypeId: [1, Validators.required],
      documentNumber: [null, Validators.required],
      genre: null,
      birthDate: null,
      cellphone: null,
      email: [null, Validators.email],
      address: null,
      flagActive: true,
      dateAt: new Date(),
      personalRegisterId: this.sessionService.user.personalId,
      users: this.fb.control([])
    });
  }

  title(str: string) {
    return str.toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase());
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    this.isSave = true;

    const values = this.form.value;
    values.name = this.title(values.name);
    values.fatherLastName = this.title(values.fatherLastName);
    values.motherLastName = this.title(values.motherLastName);
    values.email = values.email?.toLowerCase();

    this.isLoading = true;
    this.personalService.register(values)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: id => {
          this.form.get('personalId').setValue(id);

          this.toastr.success('Los datos han sido registrados exitosamente');
        }
      });
  }

  accept(): void {
    const values = this.form.value;
    this.bsModal.close(this.isSave ? values : null);
  }

  clear(): void {
    this.form.reset({
      personalId: 0,
      documentTypeId: 1,
      flagActive: true,
      dateAt: new Date(),
      users: []
    });

    this.activeTab = 'general';
  }

  addUser(): void {
    const user = { personalId: this.form.get('personalId').value };
    this.bsModal.open(UserEditComponent, { user }).then(res => {
      if (res) {
        this.form.get('users').value.push(res);
        this.toastr.success('Los datos han sido registrados exitosamente');
      }
    });
  }

  editUser(user: any, index: number) {
    this.bsModal.open(UserEditComponent, { user }).then(res => {
      if (res) {
        this.form.get('users').value.splice(index, 1, res);
        this.toastr.success('Se ha modificado el usuario');
      }
    });
  }

  removeUser(item: any, index: number): void {
    this.confirmService.open('Eliminar', '¿Desea eliminar el usuario?').then(res => {
      if (res) {
        this.isLoading = true;

        this.userService.remove(item.userId)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: success => {
              if (success) {
                this.form.get('users').value.splice(index, 1);
              } else {
                this.toastr.error('No se puede eliminar el usuario');
              }
            }
          });
      }
    });
  }

}
