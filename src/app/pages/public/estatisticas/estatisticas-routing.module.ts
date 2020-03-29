import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {EvolucaoComponent} from './evolucao/evolucao.component';
import {AreasComponent} from './areas/areas.component';

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
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstatisticasRoutingModule { }
