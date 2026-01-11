import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    provideKeycloak,
    withAutoRefreshToken,
    AutoRefreshTokenService,
    UserActivityService,
    createInterceptorCondition,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    IncludeBearerTokenCondition
} from 'keycloak-angular';
import { includeBearerTokenInterceptor } from 'keycloak-angular';

import { AppComponent } from './app.component';
import { CustomersComponent } from './customers/customers.component';
import { ProductsComponent } from './products/products.component';
import { BillsComponent } from './bills/bills.component';
import { BillsDetailsComponent } from './bills-details/bills-details.component';
import { authGuard } from './guards/auth-guard';

const routes: Routes = [
    { path: '', redirectTo: 'customers', pathMatch: 'full' },
    { path: 'customers', component: CustomersComponent, canActivate: [authGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
    { path: 'bills/:customerId', component: BillsComponent, canActivate: [authGuard] },
    { path: 'bills-details/:billsId', component: BillsDetailsComponent, canActivate: [authGuard] }
];

const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^http:\/\/localhost:8888\/.*/i
});

@NgModule({
    declarations: [
        AppComponent,
        CustomersComponent,
        ProductsComponent,
        BillsComponent,
        BillsDetailsComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    providers: [
        provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
        {
            provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
            useValue: [urlCondition]
        },
        provideKeycloak({
            config: {
                url: 'http://localhost:8080',
                realm: 'emsi-realm',
                clientId: 'ecom-web-app'
            },
            initOptions: {
                onLoad: 'check-sso',
                checkLoginIframe: false
            },
            features: [
                withAutoRefreshToken({
                    onInactivityTimeout: 'logout',
                    sessionTimeout: 60000
                })
            ],
            providers: [AutoRefreshTokenService, UserActivityService]
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

