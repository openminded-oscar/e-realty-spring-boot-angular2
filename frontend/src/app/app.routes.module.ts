import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guargs/auth.guard';

const appRoutes: Routes = [
  {
    path: ``,
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: `admin`,
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user-cabinet/user-cabinet.module').then((m) => m.UserCabinetModule),
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false}
    ),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutesModule {
}
