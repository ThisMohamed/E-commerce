import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../core/services/orders/orders.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { IuserToken } from '../../core/models/user-token/iuser-token.interface';
import { Iorder } from '../../core/models/order/iorder.interface';
import { CartService } from '../../core/services/cart/cart.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  imports: [RouterLink, DatePipe, LoadingSpinnerComponent, EmptyStateComponent, TranslatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  ordersList: WritableSignal<Iorder[]> = signal([]);
  isShowOrderDetails = signal<boolean>(false);
  isLoadingOrders = signal<boolean>(true);
  openOrders = signal(new Set<number>());

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      if (localStorage.getItem('token')) {
        this.getNumOfCartItems();
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode<IuserToken>(token!);
        const userId = decodedToken.id;
        this.getOrders(userId);
      } else {
        this.isLoadingOrders.set(false);
      }
    }
  }

  getNumOfCartItems() {
    this.cartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.cartService.numOfCartItems.set(res.numOfCartItems);
      },
    });
  }

  toggleOrderDetails(id: number) {
    const current = new Set(this.openOrders());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.openOrders.set(current);
  }

  getOrders(userId: string) {
    this.isLoadingOrders.set(true);
    this.ordersService.getuserOrders(userId).subscribe({
      next: (res) => {
        this.isLoadingOrders.set(false);
        this.ordersList.set(res);
      },
      error: (err) => {
        this.isLoadingOrders.set(false);
      },
    });
  }
}
