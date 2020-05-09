import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {EvolucaoComponent} from './evolucao/evolucao.component';
import {AreasComponent} from './areas/areas.component';
import {OrientadoresComponent} from './orientadores/orientadores.component';

const routes: Routes = [
    {
      path: '',
      component: EvolucaoComponent,
      data: {
        pageName: 'Levantamento de publicações'
      }
    },
    {
      path: 'area',
      component: AreasComponent,
      data: {
        pageName: 'Área de conhecimento'
      }
    },
    {
      path: 'orientador',
      component: OrientadoresComponent,
      data: {
        pageName: 'Orientadores'
      }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstatisticasRoutingModule { }
