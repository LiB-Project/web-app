import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from '../../core/ui.module';
import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import {NgxWebstorageModule} from 'ngx-webstorage';
import { CursoListComponent } from './curso/cursolist/cursolist.component';
import { AdminComponent } from './admin.component';
import { CadastroCursoComponent } from './curso/cadastro-curso/cadastro-curso.component';
import { OrientadorListComponent } from './orientador/orientadorlist/orientadorlist.component';
import { CadastroOrientadorComponent } from './orientador/cadastro-orientador/cadastro-orientador.component';
import { EditOrientadorComponent } from './orientador/edit-orientador/edit-orientador.component';
import { CadastroDocumentoComponent } from './documento/cadastro-documento/cadastro-documento.component';
import { DocumentoListComponent } from './documento/documento-list/documento-list.component';
import { EditDocumentComponent } from './documento/edit-document/edit-document.component';
import { UserStorageService } from 'src/app/core/services/user-storage.service';
import { CursoService } from 'src/app/core/services/curso.service';
import { OrientadorService } from 'src/app/core/services/orientador.service';
import { GrandeAreaService } from 'src/app/core/services/grande-area.service';
import { SubAreaService } from 'src/app/core/services/sub-area.service';
import { DocumentoService } from 'src/app/core/services/documento.service';
import { ComponentsModule } from 'src/app/components/components.module';
import {MaterializeModule} from 'angular2-materialize';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    ComponentsModule,
    AdminRoutingModule,
    NgxWebstorageModule.forRoot()
  ],
  declarations: [
    AdminComponent,
    HomeComponent,
    CursoListComponent,
    CadastroCursoComponent,
    OrientadorListComponent,
    EditOrientadorComponent,
    CadastroOrientadorComponent,
    CadastroDocumentoComponent,
    DocumentoListComponent,
    EditDocumentComponent,
  ],
  entryComponents: [
    EditOrientadorComponent,
    CadastroOrientadorComponent
  ]
})
export class AdminModule { }
