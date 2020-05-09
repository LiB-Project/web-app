import {Component, OnDestroy, OnInit} from '@angular/core';
import {Orientador} from '../../../../core/model/orientador.model';
import {Observable, Subscription} from 'rxjs';
import {OrientadorService} from '../../../../core/services/orientador.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {EstatisticaService} from '../../../../core/services/estatistica.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-orientadores',
  templateUrl: './orientadores.component.html',
  styleUrls: ['./orientadores.component.css']
})
export class OrientadoresComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  orientadores: Orientador[] = [];
  filteredOrientadores: Observable<Orientador[]>;

  formGroup: FormGroup = new FormGroup({
    orientador: new FormControl(null, Validators.required),
  });

  dadosCarregados: any[];

  constructor(private orientadorService: OrientadorService,
              private estatisticaService: EstatisticaService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.orientadorService.listarTodos().subscribe(
        response => {
          this.orientadores = response.body;
        }, error => {
          console.log(error);
        }
      )
    );

    this.filteredOrientadores = this.formGroup.get('orientador').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(nome => nome ? this._filterOrientador(nome) : this.orientadores.slice())
      );
  }

  displayOrientador(orientador?: Orientador): string | undefined {
    return orientador ? orientador.nome : undefined;
  }

  carregarDados(): void {
    this.subscriptions.push(
      this.estatisticaService.carregarPorOrientador(this.formGroup.get('orientador').value.id)
        .subscribe(response => {
          this.dadosCarregados = response.body;
          this.preencherGrafico();
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private _filterOrientador(value: string): Orientador[] {
    const filterValue = value.toLowerCase();
    return this.orientadores.filter(orientador => orientador.nome.toLowerCase().includes(filterValue));
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
        text: 'Trabalhos orientados agrupados por área de conhecimento'
      },
      series: seriesMap
    });
  }
}
