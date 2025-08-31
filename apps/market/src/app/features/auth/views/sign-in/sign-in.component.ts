import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, SessionService } from '@market-commons';
import { ITokenResponse } from '@market/models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean;
  message: string;
  formIndex: number = 1;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activateRoute = inject(ActivatedRoute);
  private readonly session = inject(SessionService);
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  sigIn(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      return;
    }

    this.isLoading = true;
    this.authService.signIn(this.form.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (token: ITokenResponse) => {
          this.session.create(token);

          const { returnUrl } = this.activateRoute.snapshot.queryParams;
          this.router.navigateByUrl(returnUrl || '/');
        },
        error: (err) => {
          this.message = this.getMessageError(err);
        }
      });
  }

  getMessageError(err): string {
    let message: string = '';
    switch (typeof err?.error) {
      case 'string':
        message = err?.error;
        break;

      case 'object':
        message = err?.error?.message || 'Ocurrió un error inesperado';
        break;
    }

    return message;
  }

  changeForm(index: number): void {
    this.formIndex = index;
    this.message = null;
    this.form.markAsUntouched();
  }

  recoveryPassword(): void {
    const { username } = this.form.value;

    if (!username) {
      this.form.get('username').markAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.recovery(username)
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.message = res.Mensaje;
        },
        error: err => {
          this.isLoading = false;
          this.message = this.getMessageError(err);
        }
      });
  }

}
