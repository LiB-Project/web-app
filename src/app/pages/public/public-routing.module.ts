import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './public.component';
import { BuscaComponent } from './busca/busca.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { SobreComponent } from './sobre/sobre.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    data: {
      pageName: 'Menu'
    },
    children: [
      { path: '' , component: BuscaComponent, data: {pageName: 'Página inicial'} },
      {
        path: '',
        data: { pageName: 'Pesquisa' },
        children: [
          {
            path: 'document/:documentId',
            component: DocumentDetailComponent,
            data: {
              pageName: 'Visualização trabalho'
            }
          }
        ]
      },
      { path: 'sobre', component: SobreComponent, data: {pageName: 'Sobre'} },
      {
        path: 'estatisticas',
        loadChildren: () => import('./estatisticas/estatisticas.module').then(m => m.EstatisticasModule),
        data: {
          pageName: 'Estatísticas'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
