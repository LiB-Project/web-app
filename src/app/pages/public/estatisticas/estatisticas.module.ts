import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstatisticasRoutingModule } from './estatisticas-routing.module';
import { EstatisticasComponent } from './estatisticas.component';
import { EvolucaoComponent } from './evolucao/evolucao.component';
import { OrientadoresComponent } from './orientadores/orientadores.component';
import { AreasComponent } from './areas/areas.component';
import { CursoComponent } from './curso/curso.component';
import {FlexModule} from '@angular/flex-layout';
import {ComponentsModule} from '../../../components/components.module';
import {MaterializeModule} from 'angular2-materialize';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [EstatisticasComponent, EvolucaoComponent, OrientadoresComponent, AreasComponent, CursoComponent],
  imports: [
    CommonModule,
    EstatisticasRoutingModule,
    FlexModule,
    ComponentsModule,
    MaterializeModule,
    ReactiveFormsModule
  ]
})
export class EstatisticasModule { }
