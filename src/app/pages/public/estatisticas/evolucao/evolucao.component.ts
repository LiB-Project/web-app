import {Component, OnDestroy, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {Subscription} from 'rxjs';
import {EstatisticaService} from '../../../../core/services/estatistica.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EnumValues} from 'enum-values';
import {NivelCurso} from '../../../../core/model/nivelCurso.enum';
import {Curso} from '../../../../core/model/curso.model';
import {CursoService} from '../../../../core/services/curso.service';
import {ConfiguracaoService} from '../../../../core/services/configuracao.service';
import {Title} from '@angular/platform-browser';

const More = require('highcharts/highcharts-more');

@Component({
  selector: 'app-evolucao',
  templateUrl: './evolucao.component.html',
  styleUrls: ['./evolucao.component.css']
})
export class EvolucaoComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  anoList: number[] = [];
  cursoList: Curso[] = [];
  cursoListFiltered: Curso[] = [];
  levantamentoList: any[] = [];
  areaEstatisticaList: any[] = [];

  formGraficoLevantamento: FormGroup = new FormGroup({
    anoInferior: new FormControl('', Validators.required),
    anoSuperior: new FormControl('', Validators.required),
    nivel: new FormControl('Todos', Validators.required),
    curso: new FormControl('Todos', Validators.required),
  });

  constructor(private estatisticaService: EstatisticaService,
              private configService: ConfiguracaoService,
              private titleService: Title,
              private cursoService: CursoService) { }

  private definirAnosSelecionados(): void {
    const min = Math.min(...this.anoList);
    const max = Math.max(...this.anoList);
    this.formGraficoLevantamento.get('anoInferior').setValue(min);
    this.formGraficoLevantamento.get('anoSuperior').setValue(max);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.estatisticaService.listarAnoDeDocumentos()
        .subscribe(response => {
          this.anoList = response.body;
          console.log('ANOS DOS DOCUMENTOS ', this.anoList);
          this.definirAnosSelecionados();
          this.carregarLevantamento();
        })
    );

    this.subscriptions.push(
      this.cursoService.listarTodos()
        .subscribe(response => {
          this.cursoList = response.body;
          this.cursoListFiltered = response.body;
        })
    );

    this.formGraficoLevantamento.get('nivel').valueChanges.subscribe(value => {
      if (value === 'Todos') {
        this.cursoListFiltered = this.cursoList;
      } else {
        this.filtrarCursos(value);
      }
    });

    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
        .subscribe(response => this.titleService.setTitle(response.body + ' - Levantamento de publicações'))
    );
  }

  preencherGrafico(): void {
    // const mapLevantamento = this.levantamentoList.map(lev => {
    //   return {
    //     name: `Total`,
    //     data: `${lev.quantidade}`
    //   };
    // });
    const mapLevantamento = this.levantamentoList.map(lev => lev.quantidade);
    const anos = this.anoList.map(a => a.toString());


    // @ts-ignore
    Highcharts.chart('container-grafico', {
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: anos,
        crosshair: true
      },
      yAxis: {
        title: {
          text: 'Quantidade de trabalhos'
        }
      },
      title: {
        text: 'Evolução de publicações'
      },
      series: [{
        type: 'column',
        name: 'Total',
        data: mapLevantamento
      }]
    });
  }

  listarTodosOsNiveis(): any[] {
    return EnumValues.getNamesAndValues(NivelCurso);
  }

  carregarLevantamento(): void {
    const anoInferior = this.formGraficoLevantamento.get('anoInferior').value;
    const anoSuperior = this.formGraficoLevantamento.get('anoSuperior').value;
    const curso = this.formGraficoLevantamento.get('curso').value;
    this.subscriptions.push(
      this.estatisticaService.carregarLevantamento(anoInferior, anoSuperior, curso)
        .subscribe(response => {
          this.levantamentoList = response.body.levantamentoList;
          this.areaEstatisticaList = response.body.areaEstatisticaList;
          this.preencherGrafico();
          this.preencherGraficoDeAgrupamentoPorAreas();
        })
    );
  }

  preencherGraficoDeAgrupamentoPorAreas(): void {
    const seriesMap = [];
    this.areaEstatisticaList.forEach(dado => {
      seriesMap.push({
        name: dado.areaBasica as string,
        data: dado.subAreaQuantidadeList.map(item =>
          ({name: item.subArea.nome as string, value: item.quantidade as number}))
      });
    });

    Highcharts.chart('container-grafico-area', {
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

  filtrarCursos(nivelEscolhido: NivelCurso): void {
    this.cursoListFiltered = this.cursoList.filter(c => c.nivel === nivelEscolhido);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
