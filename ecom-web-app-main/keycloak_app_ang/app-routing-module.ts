import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Products } from './ui/products/products';
import { Customers } from './ui/customers/customers';
import { Unauthorized } from './ui/unauthorized/unauthorized';
import { authGuard } from './guards/auth-guard';

const routes: Routes = [
  { path: "products", component: Products, canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: "customers", component: Customers, canActivate: [authGuard], data: { roles: ['USER'] } },
  { path: "unauthorized", component: Unauthorized }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
