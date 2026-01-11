import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  AutoRefreshTokenService,
  UserActivityService, createInterceptorCondition, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG
} from 'keycloak-angular';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Customers } from './ui/customers/customers';
import { Products } from './ui/products/products';
import { Unauthorized } from './ui/unauthorized/unauthorized';

const urlCondition = createInterceptorCondition({
  urlPattern: /:8087/i,
  bearerPrefix: 'Bearer'
});

@NgModule({
  declarations: [
    App,
    Customers,
    Products,
    Unauthorized
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
    // HttpClientModule is removed from here
  ],
  providers: [
    // 1. Modern Keycloak Provider
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',
        realm: 'emsi-realm',
        clientId: 'ecom-client-ang'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
      },
      features: [
        // withAutoRefreshToken({
        //   onInactivityTimeout: 'logout',
        //   sessionTimeout: 60000 // 1 minute
        // }) // Keeps your session alive automatically
      ],
      providers: [AutoRefreshTokenService, UserActivityService]
    }),

    // 2. Functional HTTP Setup (Replacing Deprecated Modules & Interceptors)
    provideHttpClient(
      withInterceptors([
        includeBearerTokenInterceptor
      ])
    ),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [urlCondition]
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
