import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RealtyObjEditComponent} from './realty-obj-edit/realty-obj-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AddressService} from './services/address.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AddressInputComponent} from './address-input/address-input.component';
import {ArchwizardModule} from 'angular-archwizard';
import {UserRegionInputComponent} from './commons/user-region-input/user-region-input.component';
import {ConfigService} from './services/config.service';
import {FileUploadService} from './services/file-upload.service';
import {RealtyObjService} from './services/realty-obj.service';
import {RealtorService} from './services/realtor.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RealtyObjsGalleryComponent} from './realty-objs-gallery/realty-objs-gallery.component';
import {RouterModule, Routes} from '@angular/router';
import {UserService} from './services/user.service';
import {SigninButtonComponent} from './commons/signin-button/signin-button.component';
import {SigninSignoutService} from './services/auth/signin-signout.service';
import {SignupButtonComponent} from './commons/signup-button/signup-button.component';
import {SignupService} from './services/auth/signup.service';
import {SignoutButtonComponent} from './commons/signout-button/signout-button.component';
import {RealtyObjDetailsComponent} from './realty-obj-details/realty-obj-details.component';
import {RealtorsGalleryComponent} from './realtor/realtors-gallery/realtors-gallery.component';
import {InterestService} from './services/interest.service';
import {ReviewsService} from './services/reviews.service';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {ErrorService} from './services/common/ErrorService';
import {AllHttpInterceptor} from './services/common/HttpInterceptor';
import {GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {AuthHttpInterceptor} from './services/common/AuthHttpInterceptor';
import {CookieService} from './services/common/CookieService';
import {GlobalNotificationComponent} from './global-notification/global-notification.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {HeaderComponent} from './header/header.component';
import {AuthGuard} from './guargs/auth.guard';
import {RealtorContactComponent} from './realtor/realtor-contact/realtor-contact.component';
import {SharedModule} from './common/shared.module';

const appRoutes: Routes = [
  {
    path: ``,
    loadChildren: () => import('./home.module').then((m) => m.HomeModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user-cabinet/user-cabinet.module').then((m) => m.UserCabinetModule),
  },
];

const config: SocketIoConfig = {url: 'http://localhost:8081', options: {transports: ['websocket', 'polling']}};

@NgModule({
  declarations: [
    AppComponent,
    RealtyObjEditComponent,
    AddressInputComponent,
    UserRegionInputComponent,
    RealtyObjsGalleryComponent,
    SigninButtonComponent,
    SignupButtonComponent,
    SignoutButtonComponent,
    RealtyObjDetailsComponent,
    RealtorsGalleryComponent,
    GlobalNotificationComponent,
    RealtorContactComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    HttpClientModule,
    SocialLoginModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false}
    ),
    NgbModule,
    ArchwizardModule,
    BrowserAnimationsModule,
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
