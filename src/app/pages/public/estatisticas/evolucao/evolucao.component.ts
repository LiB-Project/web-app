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
          this.levantamentoList = response.body;
          console.log(this.levantamentoList);
          this.preencherGrafico();
        })
    );
  }

  filtrarCursos(nivelEscolhido: NivelCurso): void {
    this.cursoListFiltered = this.cursoList.filter(c => c.nivel === nivelEscolhido);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
