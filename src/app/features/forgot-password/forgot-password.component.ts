import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ErrorMessageAlertComponent } from '../../shared/components/error-message-alert/error-message-alert.component';
import { ToasterService } from '../../core/services/toaster/toaster.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, ReactiveFormsModule, ErrorMessageAlertComponent, TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly toasterService = inject(ToasterService);
  step = signal<number>(1);
  isForgotPasswordLoadind = signal<boolean>(false);
  isVerifyResetCodeLoadind = signal<boolean>(false);
  isResetPasswordLoadind = signal<boolean>(false);
  isResetPasswordDone = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  verifyResetCodeForm: FormGroup = this.fb.group({
    resetCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  resetPasswordForm: FormGroup = this.fb.group(
    {
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      reNewPassword: ['', [Validators.required]],
    },
    { validators: [this.confirmPassword] },
  );

  confirmPassword(group: AbstractControl) {
    const newPassword = group.get('newPassword');
    const reNewPassword = group.get('reNewPassword');
    if (!newPassword || !reNewPassword) return null;
    if (reNewPassword.errors && !reNewPassword.errors['misMatch']) {
      return null;
    }
    if (newPassword.value !== reNewPassword.value) {
      reNewPassword.setErrors({ ...reNewPassword.errors, misMatch: true });
    } else {
      if (reNewPassword.errors) {
        const { misMatch, ...others } = reNewPassword.errors;
        reNewPassword.setErrors(Object.keys(others).length ? others : null);
      }
    }
    return null;
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.isForgotPasswordLoadind.set(true);
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (res) => {
          this.isForgotPasswordLoadind.set(false);
          this.toasterService.success(res.message);
          this.step.set(2);
        },
        error: (err) => {
          this.isForgotPasswordLoadind.set(false);
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
  verifyResetCode() {
    if (this.verifyResetCodeForm.valid) {
      this.isVerifyResetCodeLoadind.set(true);
      this.authService.verifyResetCode(this.verifyResetCodeForm.value).subscribe({
        next: (res) => {
          this.isVerifyResetCodeLoadind.set(false);
          this.toasterService.success('toasts.codeVerified');
          this.step.set(3);
        },
        error: (err) => {
          this.isVerifyResetCodeLoadind.set(false);
        },
      });
    } else {
      this.verifyResetCodeForm.markAllAsTouched();
    }
  }
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const data = {
        email: this.forgotPasswordForm.get('email')?.value,
        newPassword: this.resetPasswordForm.get('newPassword')?.value,
      };
      this.isResetPasswordLoadind.set(true);
      this.authService.resetPassword(data).subscribe({
        next: (res) => {
          this.isResetPasswordLoadind.set(false);
          this.toasterService.success('toasts.passwordReset');
          this.isResetPasswordDone.set(true);
        },
        error: (err) => {
          this.isResetPasswordLoadind.set(false);
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  ResendResetCode() {
    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: (res) => {
        this.toasterService.success(res.message);
      },
    });
  }

  BackToChangeEmailAddress() {
    this.step.set(1);
    this.verifyResetCodeForm.reset();
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}
