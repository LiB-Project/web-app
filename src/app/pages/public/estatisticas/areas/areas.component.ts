import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Curso} from '../../../../core/model/curso.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GrandeAreaService} from '../../../../core/services/grande-area.service';
import {GrandeArea} from '../../../../core/model/grande-area.model';
import {EstatisticaService} from '../../../../core/services/estatistica.service';
import * as Highcharts from 'highcharts';
const More = require('highcharts/highcharts-more');

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  grandeAreaList: GrandeArea[] = [];
  dadosCarregados: any[];

  formGraficoArea: FormGroup = new FormGroup({
    grandeAreaId: new FormControl(null, Validators.required)
  });


  constructor(private areaService: GrandeAreaService,
              private estatisticaService: EstatisticaService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.areaService.listar()
        .subscribe(response => this.grandeAreaList = response.body)
    );

    this.carregarDados();
  }

  preencherGrafico(): void {
    const seriesMap = [];
    this.dadosCarregados.forEach(dado => {
      seriesMap.push({
          name: dado.areaBasica as string,
          data: dado.subAreaQuantidadeList.map(item =>
            ({name: item.subArea.nome as string, value: item.quantidade as number}))
      });
    });

    Highcharts.chart('container-grafico', {
      chart: {
        type: 'packedbubble',
        backgroundColor: ''
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}'
      },
      plotOptions: {
        packedbubble: {
          minSize: 30,
          maxSize: 140,
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          },
        }
      },
      legend: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        itemStyle: {
          color: '#E0E0E3'
        },
        itemHoverStyle: {
          color: '#FFF'
        },
        itemHiddenStyle: {
          color: '#606063'
        },
        title: {
          style: {
            fontSize: '18pt',
            color: '#C0C0C0'
          }
        }
      },
      title: {
        style: {
          color: 'black',
          fontSize: '16pt',
          fontWeight: 'bold'
        },
        text: 'Trabalhos agrupados por área de conhecimento'
      },
      series: seriesMap
    });
  }

  carregarDados(): void {
    this.subscriptions.push(
      this.estatisticaService.carregarAreas(this.formGraficoArea.get('grandeAreaId').value)
        .subscribe(response => {
          this.dadosCarregados = response.body;
          this.preencherGrafico();
        })
    );
  }

}
