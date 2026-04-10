import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { AddressesService } from '../../../../core/services/addresses/addresses.service';
import { UserAddress } from '../../../../core/models/user-address/user-address.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageAlertComponent } from '../../../../shared/components/error-message-alert/error-message-alert.component';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-addresses',
  imports: [ReactiveFormsModule, ErrorMessageAlertComponent, TranslatePipe],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css',
})
export class AddressesComponent implements OnInit {
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly addressesService = inject(AddressesService);
  private readonly fb = inject(FormBuilder);
  private readonly toasterService = inject(ToasterService);
  private readonly translateService = inject(TranslateService);
  addressList: WritableSignal<UserAddress[]> = signal([]);
  isLoadingAddresses = signal(true);
  isShowModal = signal<boolean>(false);
  isAddingAddress = signal<boolean>(false);

  addressesForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    details: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getUserAddresses();
    }
  }

  getUserAddresses() {
    this.isLoadingAddresses.set(true);
    this.addressesService.getLoggedUserAddresses().subscribe({
      next: (res) => {
        this.isLoadingAddresses.set(false);
        this.addressList.set(res.data);
      },
      error: (err) => {
        this.isLoadingAddresses.set(false);
      },
    });
  }

  delteAddress(addressId: string) {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const msg = this.translateService.instant('addresses.deleteConfirm');
      const isConfirmed = window.confirm(msg);
      if (isConfirmed) {
        this.addressesService.removeUserAddress(addressId).subscribe({
          next: (res) => {
            this.toasterService.success(res.message);
            this.addressList.set(res.data);
          },
        });
      }
    }
  }

  closeModalAddress() {
    this.isShowModal.set(false);
    this.addressesForm.reset();
  }
  openModalAddress() {
    this.isShowModal.set(true);
  }

  submitForm() {
    if (this.addressesForm.valid) {
      this.isAddingAddress.set(true);
      this.addressesService.addUserAddress(this.addressesForm.value).subscribe({
        next: (res) => {
          this.isAddingAddress.set(false);
          this.closeModalAddress();
          this.addressesForm.reset();
          this.toasterService.success(res.message);
          this.addressList.set(res.data);
        },
        error: (err) => {
          this.isAddingAddress.set(false);
        },
      });
    } else {
      this.addressesForm.markAllAsTouched();
    }
  }
}
