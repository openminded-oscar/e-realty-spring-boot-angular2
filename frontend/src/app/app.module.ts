import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {AddressService} from './services/address.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ConfigService} from './services/config.service';
import {FileUploadService} from './services/file-upload.service';
import {RealtyObjService} from './services/realty-obj.service';
import {RealtorService} from './services/realtor.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserService} from './services/user.service';
import {SigninButtonComponent} from './commons/signin-button/signin-button.component';
import {SigninSignoutService} from './services/auth/signin-signout.service';
import {SignupButtonComponent} from './commons/signup-button/signup-button.component';
import {SignupService} from './services/auth/signup.service';
import {SignoutButtonComponent} from './commons/signout-button/signout-button.component';
import {InterestService} from './services/interest.service';
import {ReviewsService} from './services/reviews.service';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {ErrorService} from './services/common/ErrorService';
import {AllHttpInterceptor} from './services/common/HttpInterceptor';
import {GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {AuthHttpInterceptor} from './services/common/AuthHttpInterceptor';
import {CookieService} from './services/common/CookieService';
import {GlobalNotificationComponent} from './global-notification/global-notification.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutesModule} from './app.routes.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const config: SocketIoConfig = {url: 'http://localhost:8081', options: {transports: ['websocket', 'polling']}};

@NgModule({
  declarations: [
    AppComponent,
    SigninButtonComponent,
    SignupButtonComponent,
    SignoutButtonComponent,
    HeaderComponent,
    GlobalNotificationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocialLoginModule,
    AppRoutesModule,
    BrowserAnimationsModule,
    NgbToastModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    AddressService,
    CookieService,
    ConfigService,
    InterestService,
    ReviewsService,
    FileUploadService,
    RealtyObjService,
    RealtorService,
    UserService,
    SigninSignoutService,
    SignupService,
    ErrorService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AllHttpInterceptor,
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
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '510686946042-rijrprort52tnmpm0e0ir20qgngt9cha'
            ),
          }]
      }
    }],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
