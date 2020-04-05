import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public-routing.module';
import { BuscaComponent } from './busca/busca.component';
import { PublicComponent } from './public.component';
import { UiModule } from 'src/app/core/ui.module';
import { RecentesTabComponent } from './recentes-tab/recentes-tab.component';
import { DocumentResultComponent } from './document-result/document-result.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { CloudWordsComponent } from './cloud-words/cloud-words.component';
import { SobreComponent } from './sobre/sobre.component';
import { ComponentsModule } from 'src/app/components/components.module';
import {MaterializeModule} from 'angular2-materialize';
import {FormsModule} from '@angular/forms';
import {SlickCarouselModule} from 'ngx-slick-carousel';

@NgModule({
  declarations: [
    BuscaComponent,
    PublicComponent,
    RecentesTabComponent,
    DocumentResultComponent,
    DocumentDetailComponent,
    CloudWordsComponent,
    SobreComponent
  ],
    imports: [
        CommonModule,
        UiModule,
        ComponentsModule,
        PublicRoutingModule,
        MaterializeModule,
        FormsModule,
        SlickCarouselModule,
    ],
  entryComponents: [PublicComponent]
})
export class PublicModule { }
