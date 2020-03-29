import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconNavigationComponent } from './icon-navigation/icon-navigation.component';
import { UiModule } from '../core/ui.module';
import { LogomarcaComponent } from './logomarca/logomarca.component';
import { LocalizacaoComponent } from './localizacao/localizacao.component';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [IconNavigationComponent, LogomarcaComponent, LocalizacaoComponent],
  imports: [
    CommonModule,
    UiModule,
    RouterModule
  ],
    exports: [IconNavigationComponent, LogomarcaComponent, LocalizacaoComponent]
})
export class ComponentsModule { }
