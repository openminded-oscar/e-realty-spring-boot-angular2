import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './core/app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SignInButtonComponent} from './core/signin-button/sign-in-button.component';
import {SignupButtonComponent} from './core/signup-button/signup-button.component';
import {SignOutButtonComponent} from './core/signout-button/sign-out-button.component';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {HttpErrorsInterceptor} from './app-services/common/HttpErrorInterceptor';
import {AuthHttpInterceptor} from './app-services/common/AuthHttpInterceptor';
import {CookieService} from './app-services/common/CookieService';
import {GlobalNotificationComponent} from './core/global-notification/global-notification.component';
import {HeaderComponent} from './core/header/header.component';
import {SharedModule} from './shared/shared.module';
import {AppRoutesModule} from './app.routes.module';
import {GoogleLoginProvider, SocialLoginModule} from '@abacritt/angularx-social-login';
import {GoogleSignInButtonComponent} from './core/google-sign-in-button/google-sign-in-button.component';
import {SignInModalComponent} from './core/sign-in-modal/sign-in-modal.component';
import {SignUpModalComponent} from './core/sign-up-modal/sign-up-modal.component';

const config: SocketIoConfig = {url: 'http://localhost:8081', options: {transports: ['websocket', 'polling']}};

@NgModule({
  declarations: [
    AppComponent,
    SignInButtonComponent,
    SignupButtonComponent,
    GoogleSignInButtonComponent,
    SignOutButtonComponent,
    GlobalNotificationComponent,
    HeaderComponent,
    SignInModalComponent,
    SignUpModalComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    SocialLoginModule,
    AppRoutesModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorsInterceptor,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
      deps: [CookieService]
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        lang: 'en',
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '510686946042-rijrprort52tnmpm0e0ir20qgngt9cha.apps.googleusercontent.com', {
                oneTapEnabled: false,
              }
            ),
          }]
      }
    }],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
