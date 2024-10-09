import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guargs/auth.guard';

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
