import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorMessageAlertComponent } from '../../../../shared/components/error-message-alert/error-message-alert.component';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { jwtDecode } from 'jwt-decode';
import { IuserToken } from '../../../../core/models/user-token/iuser-token.interface';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, ErrorMessageAlertComponent, TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toasterService = inject(ToasterService);
  private readonly translateService = inject(TranslateService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  userId = signal<string>('');
  showCurrentPassword = signal<boolean>(false);
  showNewPassword = signal<boolean>(false);
  showRePassword = signal<boolean>(false);
  isChangingPassword = signal(false);
  changePasswordSubmitted = signal(false);
  isUpdatingUserData = signal<boolean>(false);
  updateUserDataeErrorMsg = signal<string>('');
  updateUserDataeSuccessMsg = signal<string>('');

  updateUserDataForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  });

  changePasswordForm: FormGroup = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
    },
    { validators: [this.confirmPassword, this.sameAsCurrent] },
  );

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode<IuserToken>(token!);
        this.userId.set(decodedToken.id);
      }
      this.authService.getLoggedUserData().subscribe({
        next: (res) => {
          const user = res.data;
          this.authService.loggedUser.set(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.updateUserDataForm.patchValue({
            name: user.name,
            email: user.email,
            phone: user.phone,
          });
        },
        error: () => {
          const user = this.authService.loggedUser() ||
            (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null);
          if (user) {
            this.updateUserDataForm.patchValue({
              name: user.name,
              email: user.email,
              phone: user.phone,
            });
          }
        },
      });
    }
  }

  sameAsCurrent(group: AbstractControl) {
    const currentPassword = group.get('currentPassword');
    const password = group.get('password');
    if (!currentPassword || !password) return null;
    if (password.errors && !password.errors['sameAsCurrent']) return null;
    if (currentPassword.value && password.value && currentPassword.value === password.value) {
      password.setErrors({ ...password.errors, sameAsCurrent: true });
    } else {
      if (password.errors) {
        const { sameAsCurrent, ...others } = password.errors;
        password.setErrors(Object.keys(others).length ? others : null);
      }
    }
    return null;
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

  updateUserData() {
    if (this.updateUserDataForm.valid) {
      this.isUpdatingUserData.set(true);
      this.updateUserDataeErrorMsg.set('');
      this.updateUserDataeSuccessMsg.set('');
      const { name, email, phone } = this.updateUserDataForm.value;
      this.authService.updateLoggedUserData({ name, email, phone }).subscribe({
        next: (res) => {
          this.updateUserDataeErrorMsg.set('');
          this.updateUserDataeSuccessMsg.set(this.translateService.instant('toasts.profileUpdated'));
          this.isUpdatingUserData.set(false);
          const updatedUser = { ...res.user, phone };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.authService.loggedUser.set(updatedUser);
          this.updateUserDataForm.patchValue({
            name: res.user.name ?? name,
            email: res.user.email ?? email,
            phone,
          });
          this.updateUserDataForm.markAsPristine();
          this.updateUserDataForm.markAsUntouched();
        },
        error: (err) => {
          this.updateUserDataeSuccessMsg.set('');
          this.updateUserDataeErrorMsg.set(err?.error?.message || this.translateService.instant('toasts.profileUpdateFailed'));
          this.isUpdatingUserData.set(false);
        },
      });
    } else {
      this.updateUserDataForm.markAllAsTouched();
    }
  }

  changeUserPassword() {
    this.changePasswordSubmitted.set(true);
    if (this.changePasswordForm.valid) {
      this.isChangingPassword.set(true);
      this.authService.updateLoggedUserPassword(this.changePasswordForm.value).subscribe({
        next: (res) => {
          this.isChangingPassword.set(false);
          if (res.message == 'success') {
            this.userId.set('');
            this.toasterService.success('toasts.passwordChanged');
            this.changePasswordForm.reset();
            this.changePasswordSubmitted.set(false);
            setTimeout(() => {
              this.authService.signOut();
            }, 1500);
          }
        },
        error: (err) => {
          this.isChangingPassword.set(false);
        },
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  toggleshowCurrentPassword() {
    this.showCurrentPassword.set(!this.showCurrentPassword());
  }
  toggleshowNewPassword() {
    this.showNewPassword.set(!this.showNewPassword());
  }
  toggleshowRePassword() {
    this.showRePassword.set(!this.showRePassword());
  }
}
