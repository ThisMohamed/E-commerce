import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorMessageAlertComponent } from '../../../shared/components/error-message-alert/error-message-alert.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToasterService } from '../../services/toaster/toaster.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ErrorMessageAlertComponent, RouterLink, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toasterService = inject(ToasterService);
  errorMsg = signal<string>('');
  isCreateAccountLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showRePassword = signal<boolean>(false);

  registerForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      terms: [false, [Validators.requiredTrue]],
    },
    { validators: [this.confirmPassword] },
  );

  register() {
    if (this.registerForm.valid) {
      this.isCreateAccountLoading.set(true);
      const { terms, ...data } = this.registerForm.value;
      this.authService.signUp(data).subscribe({
        next: (res) => {
          this.isCreateAccountLoading.set(false);
          this.errorMsg.set('');
          this.toasterService.success('toasts.accountCreated');
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isCreateAccountLoading.set(false);
          this.errorMsg.set(err.error.message);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  confirmPassword(group: AbstractControl) {
    const password = group.get('password');
    const rePassword = group.get('rePassword');
    if (!password || !rePassword) return null;
    if (rePassword.errors && !rePassword.errors['misMatch']) {
      return null;
    }
    if (password.value !== rePassword.value) {
      rePassword.setErrors({ ...rePassword.errors, misMatch: true });
    } else {
      if (rePassword.errors) {
        const { misMatch, ...others } = rePassword.errors;
        rePassword.setErrors(Object.keys(others).length ? others : null);
      }
    }
    return null;
  }

  hasUppercase(pw: string): boolean { return /[A-Z]/.test(pw); }
  hasLowercase(pw: string): boolean { return /[a-z]/.test(pw); }
  hasNumber(pw: string): boolean { return /[0-9]/.test(pw); }
  hasSpecial(pw: string): boolean { return /[#?!@$%^&*-]/.test(pw); }
}
