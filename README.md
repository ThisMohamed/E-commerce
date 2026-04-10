# FreshCart — Angular E-Commerce Application

A full-featured, production-ready e-commerce web application built with modern Angular (v21), featuring Server-Side Rendering, real-time cart/wishlist management, bilingual support (EN/AR), dark mode, and a local analytics dashboard.

---

## Live Demo

**[https://ecommeracee.netlify.app/home](https://ecommeracee.netlify.app/home)**

Deployed on **Netlify** with SSR via `@netlify/angular-runtime`.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Architecture & Patterns](#architecture--patterns)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Configuration](#environment-configuration)

---

## Features

### Shopping Experience
- **Product Catalog** — Paginated product grid with filter sidebar (category, brand, price range, sort order) and list/grid view toggle
- **Product Details** — Swiper image gallery with 2.5× lens-style zoom on hover, tabbed details/reviews, related products, and star ratings
- **Search** — Full-text client-side product search with the same filter sidebar, URL-persisted query parameters
- **Categories & Sub-Categories** — Browse products by category hierarchy
- **Brands** — Paginated brand directory

### Cart & Checkout
- **Cart Management** — Add/remove items, update quantities in real time, clear cart, free-shipping progress indicator
- **Checkout** — Shipping address form with two payment methods:
  - **Cash on Delivery**
  - **Online Payment** via Stripe Checkout Session
- **Order History** — Accordion-style list of all past orders with payment and delivery status badges

### User Account
- **Authentication** — JWT-based login and registration with reactive form validation (email, phone regex, password strength, confirm-password cross-field validator)
- **Forgot Password** — 3-step wizard: send email → verify 6-digit OTP → reset password
- **Profile Settings** — Update name, email, phone; change password
- **Saved Addresses** — Add, view, and delete shipping addresses via a modal form
- **Wishlist** — Save products, real-time heart-icon toggle on product cards, move-to-cart button

### UI / UX
- **Dark Mode** — Class-based dark theme toggled from the navbar; persists in `localStorage`; respects `prefers-color-scheme` on first visit
- **Bilingual (EN / AR)** — Full i18n with `ngx-translate`; switching to Arabic flips the layout to RTL (`dir="rtl"` on `<html>`)
- **Responsive Design** — Mobile-first layout built with Tailwind CSS v4 + Flowbite components
- **View Transitions** — Native browser View Transitions API integrated via Angular Router
- **Smooth Scroll Restoration** — Automatically scrolls to the top of the page on every route change
- **Global Toasts** — PrimeNG `MessageService`-powered toast notifications with translated keys
- **Loading States** — `NgxSpinner` global loading spinner + per-component inline loading indicators
- **Confirmation Dialogs** — SweetAlert2 modals for destructive actions (remove from cart, clear cart, delete address)
- **Empty & Error States** — Dedicated `EmptyStateComponent` and inline `ErrorMessageAlertComponent` across all list views

### Analytics (Local)
- **Insights Dashboard** — Entirely client-side analytics stored in `localStorage`:
  - Recently viewed products (up to 50)
  - Top browsed categories (bar chart)
  - Cart and wishlist activity counters
  - Visit streak tracker
  - Top search queries (up to 30)

---

## Tech Stack

### Framework & Core
| Technology | Version | Role |
|---|---|---|
| **Angular** | 21.2.x | Core framework |
| **TypeScript** | ~5.9.2 | Language |
| **Angular SSR** | ^21.2.1 | Server-Side Rendering |
| **Express** | ^5.1.0 | SSR server |
| **RxJS** | ~7.8.0 | Reactive async operations |

### UI & Styling
| Technology | Version | Role |
|---|---|---|
| **Tailwind CSS** | v4 | Utility-first CSS framework |
| **Flowbite** | ^4.0.1 | Tailwind component library (navbar, modals, dropdowns) |
| **PrimeNG** | ^21.1.3 | Enterprise UI components (toasts, dialogs, inputs) |
| **PrimeIcons** | ^7.0.0 | PrimeNG icon set |
| **Font Awesome** | ^7.2.0 | General icon set |
| **Google Fonts (Exo)** | — | Application font |

### Key Libraries
| Library | Version | Role |
|---|---|---|
| **Swiper** | ^12.1.2 | Touch carousel for product image gallery |
| **ngx-translate** | ^17.0.0 | i18n / internationalization |
| **ngx-pagination** | ^6.0.3 | Client-side and server-side pagination |
| **ngx-spinner** | ^21.1.0 | Global loading indicator |
| **SweetAlert2** | ^11.26.22 | Confirmation and alert modals |
| **jwt-decode** | ^4.0.0 | Decode JWT payload (extract user ID for orders) |

### Dev & Tooling
| Tool | Version | Purpose |
|---|---|---|
| **Angular CLI** | ^21.2.x | Scaffolding, build, serve |
| **Vitest** | ^4.0.8 | Unit testing (replaces Karma/Jest) |
| **PostCSS** | latest | CSS processing pipeline for Tailwind |
| **Prettier** | latest | Code formatting |
| **@netlify/angular-runtime** | ^3.0.1 | Netlify SSR deployment adapter |

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Registration page
│   │   ├── guards/
│   │   │   ├── auth/            # Redirects unauthenticated users to /login
│   │   │   └── guest/           # Redirects logged-in users away from auth pages
│   │   ├── interceptors/
│   │   │   ├── header/          # Injects Bearer token into every HTTP request
│   │   │   └── error/           # Catches HTTP errors and shows toast notifications
│   │   ├── models/              # TypeScript interfaces (Product, Cart, Order, User…)
│   │   └── services/            # All business logic services (see below)
│   ├── features/
│   │   ├── home/                # Landing page with slider, categories, products, banners
│   │   ├── shop/                # Full product catalog with filters
│   │   ├── search/              # Product search with URL query params
│   │   ├── product-details/     # Single product view with image zoom and reviews
│   │   ├── categories/          # Category grid
│   │   ├── sub-categories/      # Sub-category listing
│   │   ├── brands/              # Brand directory
│   │   ├── cart/                # Shopping cart
│   │   ├── checkout/            # Checkout form and payment selection
│   │   ├── wishlist/            # Saved products
│   │   ├── orders/              # Order history
│   │   ├── profile/             # Profile shell (settings + addresses)
│   │   ├── insights/            # Local analytics dashboard
│   │   ├── forgot-password/     # Password reset wizard
│   │   ├── support/             # Contact/help page
│   │   └── not-found/           # 404 page
│   └── shared/
│       ├── components/          # Reusable UI building blocks (see below)
│       └── pipes/               # TranslateCategoryPipe
├── environments/
│   ├── environment.ts           # Production config
│   └── environment.development.ts
public/
└── i18n/
    ├── en.json                  # English translations
    └── ar.json                  # Arabic translations
```

---

## Pages & Routes

| Route | Component | Guard | Description |
|---|---|---|---|
| `/` | — | — | Redirects to `/home` |
| `/home` | `HomeComponent` | — | Landing page |
| `/shop` | `ShopComponent` | — | Product catalog with filters |
| `/search` | `SearchComponent` | — | Product search |
| `/product-details/:id` | `ProductDetailsComponent` | — | Single product view |
| `/categories` | `CategoriesComponent` | — | Category grid |
| `/categories/:id` | `SubCategoriesComponent` | — | Sub-categories by category |
| `/brands` | `BrandsComponent` | — | Brand directory |
| `/cart` | `CartComponent` | `authGuard` | Shopping cart |
| `/checkout/:cartId` | `CheckoutComponent` | `authGuard` | Order checkout |
| `/wishlist` | `WishlistComponent` | `authGuard` | Saved products |
| `/allorders` | `OrdersComponent` | `authGuard` | Order history |
| `/profile` | `ProfileComponent` | `authGuard` | Profile shell |
| `/profile/addresses` | `AddressesComponent` | `authGuard` | Manage addresses |
| `/profile/settings` | `SettingsComponent` | `authGuard` | Account settings |
| `/insights` | `InsightsComponent` | — | Analytics dashboard |
| `/login` | `LoginComponent` | `guestGuard` | Login page |
| `/signup` | `RegisterComponent` | `guestGuard` | Registration page |
| `/forget-password` | `ForgotPasswordComponent` | `guestGuard` | Password reset |
| `/contact` | `SupportComponent` | — | Support/contact page |
| `/**` | `NotFoundComponent` | — | 404 fallback |

> All routes are **lazy-loaded** via `loadComponent(() => import(...))`.

---

## Architecture & Patterns

### Angular Signals (Modern Angular)
The entire application is built on Angular's signals API — `signal<T>()`, `computed()`, and `input()`. There are no traditional `@Input()` decorators or `NgModule` declarations. Every component is `standalone: true`.

### Server-Side Rendering (SSR)
Angular SSR is enabled throughout. All `localStorage`, `window`, and DOM access is guarded with `isPlatformBrowser(PLATFORM_ID)` to prevent hydration mismatches. Guards, interceptors, and services all follow this pattern.

### Authentication Flow
- JWT token stored in `localStorage['token']`, user object in `localStorage['user']`
- `AuthService` exposes `isLogged` and `loggedUser` writable signals consumed by the navbar and guards
- Token automatically injected into every HTTP request by `headerInterceptor`
- JWT decoded with `jwt-decode` to extract `userId` for fetching order history

### Reactive State
- `CartService.numOfCartItems` — signal updated after every cart mutation; navbar badge reflects it in real time
- `WishlistService.wishlistProductIds` — string array signal enabling instant heart-icon toggle on product cards without re-fetching

### i18n & RTL
- Language preference persisted in `localStorage['lang']`; fallback is English
- Switching to Arabic sets `document.documentElement.dir = 'rtl'` for full bidirectional layout support
- `TranslateCategoryPipe` normalises API category names to translation keys dynamically

### Shared Components
| Component | Description |
|---|---|
| `NavbarComponent` | Responsive navbar with language switcher, dark-mode toggle, cart/wishlist badges, and user dropdown |
| `FooterComponent` | 4-column footer with payment icons and navigation links |
| `ProductCardComponent` | Reusable product card with add-to-cart, wishlist toggle, rating, and discount badge |
| `ImageMagnifierComponent` | Thumbnail strip + 2.5× lens-style zoom on the main image |
| `PageHeaderComponent` | Hero banner with gradient background and breadcrumb navigation |
| `SectionTitleComponent` | Two-tone reusable section heading |
| `LoadingSpinnerComponent` | Inline loading state with configurable icon and message |
| `EmptyStateComponent` | Zero-results placeholder with configurable icon and copy |
| `ErrorMessageAlertComponent` | Inline form validation error alert |

---

## Getting Started

### Prerequisites
- **Node.js** >= 20
- **npm** >= 11

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd E-commerce

# Install dependencies
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200`. The app reloads automatically on file changes.

### Production Build

```bash
npm run build
```

Output is placed in `dist/e-commerace/browser` (static assets) and `dist/e-commerace/server` (SSR functions).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start the development server (`ng serve`) |
| `npm run build` | Build for production (SSR enabled) |
| `npm test` | Run unit tests with Vitest |

---

## Environment Configuration

Both environments point to the same REST API:

```ts
// src/environments/environment.ts
export const environment = {
  baseUrl: 'https://ecommerce.routemisr.com',
};
```

The API base URL is consumed by all services through Angular's dependency injection system.

---

## Deployment

The app is configured for **Netlify** deployment with SSR:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist/e-commerace/browser"

[[plugins]]
  package = "@netlify/angular-runtime"
```

The `@netlify/angular-runtime` plugin automatically deploys the SSR entry point as a Netlify Function, while static browser assets are served from the CDN edge.

---

## API

All data is fetched from the **Route Misr E-Commerce API**:

| Endpoint | Description |
|---|---|
| `POST /api/v1/auth/signup` | Register a new user |
| `POST /api/v1/auth/signin` | Login |
| `POST /api/v1/auth/forgotPasswords` | Send password reset email |
| `POST /api/v1/auth/verifyResetCode` | Verify OTP code |
| `PUT /api/v1/auth/resetPassword` | Set new password |
| `GET /api/v1/products` | Get all products (with filters & pagination) |
| `GET /api/v1/products/:id` | Get product details |
| `GET /api/v1/categories` | Get all categories |
| `GET /api/v1/subcategories?category=:id` | Get sub-categories |
| `GET /api/v1/brands` | Get all brands (paginated) |
| `GET /api/v1/cart` | Get user's cart |
| `POST /api/v1/cart` | Add item to cart |
| `PUT /api/v1/cart/:itemId` | Update cart item quantity |
| `DELETE /api/v1/cart/:itemId` | Remove cart item |
| `DELETE /api/v1/cart` | Clear cart |
| `GET /api/v1/wishlist` | Get wishlist |
| `POST /api/v1/wishlist` | Add to wishlist |
| `DELETE /api/v1/wishlist/:productId` | Remove from wishlist |
| `POST /api/v1/orders/:cartId` | Create cash order |
| `POST /api/v1/orders/checkout-session/:cartId` | Create Stripe checkout session |
| `GET /api/v1/orders/user/:userId` | Get user's orders |
| `GET /api/v1/addresses` | Get saved addresses |
| `POST /api/v1/addresses` | Add address |
| `DELETE /api/v1/addresses/:id` | Delete address |

---

## Author

**Mohamed Ahmed**

---

## License

This project is for educational purposes.
