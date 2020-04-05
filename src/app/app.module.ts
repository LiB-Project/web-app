import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiModule } from './core/ui.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { UnauthorizedInterceptor } from './core/interceptors/unauthorized.interceptor';
import { LoaderInterceptor } from './core/util/loader/loader.interceptor';
import { ComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import {MaterializeModule} from 'angular2-materialize';
import {SlickCarouselModule} from 'ngx-slick-carousel';

@NgModule({
   declarations: [
      AppComponent
   ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        PagesModule,
        AppRoutingModule,
        NgxUiLoaderModule,
        NgxUiLoaderHttpModule,
        ComponentsModule,
        MaterializeModule,
        SlickCarouselModule
    ],
   providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
