import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth/auth-guard';
import { guestGuard } from './core/guards/guest/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./core/auth/register/register.component').then((c) => c.RegisterComponent),
    title: 'FreshCart - SignUp',
    canActivate: [guestGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login.component').then((c) => c.LoginComponent),
    title: 'FreshCart - Login',
    canActivate: [guestGuard],
  },

  {
    path: 'forget-password',
    loadComponent: () =>
      import('./features/forgot-password/forgot-password.component').then(
        (c) => c.ForgotPasswordComponent,
      ),
    title: 'FreshCart - Forget-Password',
    canActivate: [guestGuard],
  },

  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent),
    title: 'FreshCart - Home',
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((c) => c.ProfileComponent),
    children: [
      {
        path: '',
        redirectTo: 'addresses',
        pathMatch: 'full',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/profile/components/settings/settings.component').then(
            (c) => c.SettingsComponent,
          ),
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./features/profile/components/addresses/addresses.component').then(
            (c) => c.AddressesComponent,
          ),
      },
    ],
    title: 'FreshCart - Profile',
    canActivate: [authGuard],
  },

  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then((c) => c.ShopComponent),
    title: 'FreshCart - Shop',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then((c) => c.CategoriesComponent),
    title: 'FreshCart - Categories',
  },
  {
    path: 'categories/:categoryId',
    loadComponent: () =>
      import('./features/sub-categories/sub-categories.component').then(
        (c) => c.SubCategoriesComponent,
      ),
    title: 'FreshCart - Categories',
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./features/brands/brands.component').then((c) => c.BrandsComponent),
    title: 'FreshCart - Brands',
  },

  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then((c) => c.SearchComponent),
    title: 'FreshCart - Search',
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./features/support/support.component').then((c) => c.SupportComponent),
    title: 'FreshCart - Support',
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then((c) => c.WishlistComponent),
    title: 'FreshCart - Wishlist',
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((c) => c.CartComponent),
    title: 'FreshCart - Cart',
    canActivate: [authGuard],
  },
  {
    path: 'checkout/:cartId',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((c) => c.CheckoutComponent),
    title: 'FreshCart - Checkout',
    canActivate: [authGuard],
  },

  {
    path: 'allorders',
    loadComponent: () =>
      import('./features/orders/orders.component').then((c) => c.OrdersComponent),
    title: 'FreshCart - Orders',
    canActivate: [authGuard],
  },

  {
    path: 'insights',
    loadComponent: () =>
      import('./features/insights/insights.component').then((c) => c.InsightsComponent),
    title: 'FreshCart - My Insights',
  },

  {
    path: 'product-details/:productId',
    loadComponent: () =>
      import('./features/product-details/product-details.component').then(
        (c) => c.ProductDetailsComponent,
      ),
    title: 'FreshCart - Product Details',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((c) => c.NotFoundComponent),
    title: 'FreshCart - 404',
  },
];
