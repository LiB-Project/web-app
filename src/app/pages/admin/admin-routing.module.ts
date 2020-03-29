import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CursoListComponent } from './curso/cursolist/cursolist.component';
import { AdminComponent } from './admin.component';
import { CadastroCursoComponent } from './curso/cadastro-curso/cadastro-curso.component';
import { OrientadorListComponent } from './orientador/orientadorlist/orientadorlist.component';
import { RouteGuard } from '../../core/guards/route.guard';
import { CadastroDocumentoComponent } from './documento/cadastro-documento/cadastro-documento.component';
import {EditDocumentComponent} from './documento/edit-document/edit-document.component';
import { DocumentoListComponent } from './documento/documento-list/documento-list.component';
import { Role } from 'src/app/core/model/role.enum';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    data: {
      pageName: 'Menu',
      roles: [Role.ROLE_ADMIN]
    },
    canActivate: [RouteGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          pageName: 'Página inicial'
        }
      },
      {
        path: 'gerenciarcursos',
        component: CursoListComponent,
        data: {
          pageName: 'Gerenciar cursos'
        }
      },
      {
        path: 'orientadores',
        component: OrientadorListComponent,
        data: {
          pageName: 'Gerenciar orientadores'
        }
      },
      {
        path: 'cadastrocurso',
        component: CadastroCursoComponent,
        data: {
          pageName: 'Cadastro de curso'
        }
      },
      {
        path: 'deposito',
        component: CadastroDocumentoComponent,
        data: {
          pageName: 'Depósito de documento'
        }
      },
      {
        path: 'gerenciardocumentos',
        component: DocumentoListComponent,
        data: {
          pageName: 'Gerenciar documentos'
        }
      },
      {
        path: 'editardocumento/:documentId',
        component: EditDocumentComponent,
        data: {
          pageName: 'Edição de documento'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
