import { BsModalService } from '@admin-core/services';
import { NgClass } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService, UserService } from '@market-commons';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  @Input() user!: any;
  form: FormGroup;
  roles: any[] = [];
  showPass: boolean = false;
  isAdmin: boolean = false;
  isLoading: boolean = false;
  message: string = '';

  private readonly fb = inject(FormBuilder);
  private readonly bsModal = inject(BsModalService);
  private readonly userService = inject(UserService);
  private readonly session = inject(SessionService);

  constructor() {
    this.build();
  }

  ngOnInit() {
    this.isAdmin = this.session.user?.isAdmin();

    this.isLoading = true;
    this.userService.roles()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: res => {
          this.roles = res;
        }
      });

    this.form.patchValue({ ...this.user, password: null });
    if (this.user?.userId) {
      this.form.get('userId').disable();
    }
  }

  build(): void {
    this.form = this.fb.group({
      userId: [null, Validators.required],
      personalId: [null, Validators.required],
      userTypeId: [1, Validators.required],
      userType: null,
      password: [null, Validators.required],
      flagActive: true
    });
  }

  save(): void {
    const values = this.form.getRawValue();

    values.userId = values.userId.toUpperCase();
    const typeDetail = this.roles.find(rol => rol.typeId == values.userTypeId);
    values.userType = typeDetail?.detail;

    const isCreate = !this.form.get('userId').disabled;

    let $obs = this.userService.save(values, isCreate);

    if (!this.isAdmin) {
      const updateValues = {
        userId: values.userId,
        password: values.password
      };

      $obs = this.userService.changePassword(updateValues);
    }

    this.message = '';
    this.isLoading = true;

    $obs
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: res => {
          if (res) {
            this.bsModal.close(values);
          }
        },
        error: err => {
          this.message = err.error?.message ?? 'Ha ocurrido un problema';
        }
      });
  }

}
