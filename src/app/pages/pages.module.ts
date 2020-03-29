import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { PublicModule } from './public/public.module';
import { AdminModule } from './admin/admin.module';
import { ComponentsModule } from '../components/components.module';
import { SuperUserModule } from './super-user/super-user.module';
import { UiModule } from '../core/ui.module';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    ComponentsModule,
    PublicModule,
    AdminModule,
    SuperUserModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
