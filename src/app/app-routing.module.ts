import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Admin/login/login.component';
import { AddProductComponent } from './Admin/add-product/add-product.component';
import { LandingPageComponent } from './User/landing-page/landing-page.component';
import { ProductDetailsComponent } from './User/product-details/product-details.component';
import { CartComponent } from './User/cart/cart.component';
import { ProductsComponent } from './Admin/dashboard/products/products.component';
import { OrdersComponent } from './Admin/dashboard/orders/orders.component';
import { SearchComponent } from './User/search/search.component';
import { OrderTrackingComponent } from './User/order-tracking/order-tracking.component';
import { CheckoutComponent } from './User/checkout/checkout.component';
import { OrderPlacedComponent } from './User/order-placed/order-placed.component';
import { PolicyComponent } from "./static/policy/policy.component";


import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin-dashboard/products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-dashboard/orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  { path: 'product', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'add-product',
    component: AddProductComponent, 
    canActivate: [AuthGuard],
  },
  { path: 'edit-product',
    component: AddProductComponent, 
    canActivate: [AuthGuard],
  },
  { path: 'search', component: SearchComponent },
  { path: 'order-tracking', component: OrderTrackingComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'policy', component: PolicyComponent },
  { path: '**', component: LandingPageComponent },
  { path: 'orderplaced', component: OrderPlacedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
