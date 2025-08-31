import { BsModalService } from '@admin-core/services';
import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LtDragDirective, SessionService } from '@market-commons';
import { TokenDecoded } from '@market/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, LtDragDirective, NgClass],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  message: string;
  show: boolean;
  user: TokenDecoded | null;

  private readonly authHttp = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(SessionService);
  private readonly bsModal = inject(BsModalService);
  private readonly router = inject(Router);

  ngOnInit() {
    this.user = this.session.tokenDecoded;
    this.form = this.fb.group({
      username: [this.user?.sub, Validators.required],
      password: [null, Validators.required]
    });
  }

  signIn(): void {
    if (this.form.valid) {
      this.loading = true;

      this.authHttp.signIn(this.form.value)
        .subscribe({
          next: res => {
            this.loading = false;
            this.session.create(res);
            this.bsModal.close(this.session.user);
          },
          error: (err) => {
            this.loading = false;
            this.message = err?.error;
          }
        });
    }
  }

  close(): void {
    this.bsModal.close();
    this.router.navigateByUrl('/auth/sign-in');
  }

}
