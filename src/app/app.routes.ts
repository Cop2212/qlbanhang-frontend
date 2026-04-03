import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AboutComponent } from './pages/about/about.component';
import { AffiliateComponent } from './pages/affiliate/affiliate.component';
import { TraderLoginComponent } from './pages/trader-login/trader-login.component';
import { TraderRegisterComponent } from './pages/trader-register/trader-register.component';
import { TraderDashboardComponent } from './pages/trader-dashboard/trader-dashboard.component';
import { TraderAuthGuard } from './guards/trader-auth.guard';
import { TraderGuestGuard } from './guards/trader-guest.guard';
import { TraderChangePassword } from './pages/trader-change-password/trader-change-password.component';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
    { path: 'products', component: ProductsComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    // { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'product/:slug', component: ProductDetailComponent },
    { path: 'affiliate', component: AffiliateComponent },
    { path: 'trader/login', component: TraderLoginComponent, canActivate: [TraderGuestGuard] },
    { path: 'trader/register', component: TraderRegisterComponent, canActivate: [TraderGuestGuard] },
    {
        path: 'trader/dashboard',
        component: TraderDashboardComponent,
        canActivate: [TraderAuthGuard]   // 🔒 bảo vệ dashboard
    },
    {
        path: 'trader/change-password',
        component: TraderChangePassword,
        canActivate: [TraderAuthGuard] // 🔒 phải login mới vào được
    },

    { path: '**', redirectTo: '' }
];