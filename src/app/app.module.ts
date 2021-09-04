import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Admin/login/login.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LandingPageComponent } from './User/landing-page/landing-page.component';
import { FooterComponent } from './footer/footer.component';
import { ProductCardComponent } from './User/product-card/product-card.component';
import { ProductDetailsComponent } from './User/product-details/product-details.component';
import { ProductDataService } from './shared/services/product-data-service';
import { CartComponent } from './User/cart/cart.component';
import { AddProductComponent } from './Admin/add-product/add-product.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './User/search/search.component';
import { OrderTrackingComponent } from './User/order-tracking/order-tracking.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './services/auth.guard';
import { ProductsComponent } from './Admin/dashboard/products/products.component';
import { OrdersComponent } from './Admin/dashboard/orders/orders.component';
import { ToastsContainer } from './toats.component';
import { CheckoutComponent } from './User/checkout/checkout.component';
import { OrderPlacedComponent } from './User/order-placed/order-placed.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularEmojisModule } from 'angular-emojis';
import { ClickOutsideModule } from 'ng-click-outside';
import { PolicyComponent } from './static/policy/policy.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    LandingPageComponent,
    FooterComponent,
    ProductCardComponent,
    ProductDetailsComponent,
    CartComponent,
    AddProductComponent,
    SearchComponent,
    OrderTrackingComponent,
    ProductsComponent,
    OrdersComponent,
    ToastsContainer,
    CheckoutComponent,
    OrderPlacedComponent,
    PolicyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    AngularEmojisModule,
    ClickOutsideModule,
  ],
  entryComponents: [OrderPlacedComponent],
  providers: [ProductDataService, AuthenticationService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
