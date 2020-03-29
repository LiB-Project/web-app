import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Subscription } from 'rxjs';
import {EnumValues} from 'enum-values';
import { Documento } from 'src/app/core/model/documento.model';
import { TipoBusca } from 'src/app/core/model/tipoBusca.enum';
import { PageEvent } from '@angular/material';
import { DocumentoService } from 'src/app/core/services/documento.service';
import { Options } from 'ng5-slider';
import * as moment from 'moment';
import {Curso} from '../../../core/model/curso.model';
import {LoaderService} from '../../../core/util/loader/loader.service';
import {DomSanitizer, SafeUrl, Title} from '@angular/platform-browser';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';
import {Recente} from '../../../core/value/recente.value';
import {MaterializeAction} from 'angular2-materialize';
import {QueryRelevance} from '../../../core/value/query-relevance.value';
import {QueryAdvanced} from '../../../core/value/query-advanced.value';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.css']
})
export class BuscaComponent implements OnInit, AfterViewInit {

  label: string;
  weight: number;
  tiposDeBusca: any[];
  private subscriptions: Subscription[] = [];
  formGroupSearch: FormGroup;
  queryVO: QueryAdvanced = new QueryAdvanced();
  listQueryRelevance: QueryRelevance[] = [];
  results: Documento[] = [];
  filteredResults: Documento[] = [];
  formAddRelevance: FormGroup = new FormGroup({
    field: new FormControl(EnumValues.getNameFromValue(TipoBusca, 'Título'), Validators.required),
    value: new FormControl(60, Validators.required)
  });
  formGroupSearchQuery: FormGroup = new FormGroup({
    searchValue: new FormControl(null, Validators.required)
  });

  // filter options
  minValue: number;
  maxValue: number;
  options: Options = {
    showTicks: true,
    step: 1
  };
  cursosParaFiltrar: Curso[] = [];
  cursoFiltragem = new FormControl();
  // pagination items
  pageEvent: PageEvent;

  tituloSistema: string;
  tituloInstituicao: string;
  iconBase64: SafeUrl;
  recenteList: Recente[] = [];

  sliderOptions = {
    height: 150
  };

  modalActions = new EventEmitter<string|MaterializeAction>();

  @ViewChild('slider', {static: true}) sliderElement;
  actionsSlider = new EventEmitter<string>();

  constructor(private fb: FormBuilder,
              private el: ElementRef,
              private documentoService: DocumentoService,
              private sanitizer: DomSanitizer,
              private searchService: DocumentoService,
              private configService: ConfiguracaoService,
              private loaderService: LoaderService,
              private titleService: Title) {
  }

  ngAfterViewInit(): void {

  }
  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarConfiguracao().subscribe(
      response => {
        this.tituloSistema = response.body.tituloSistema;
        this.tituloInstituicao = response.body.nomeInstituicao;
        this.iconBase64 = this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64, ' + response.body.iconeBase64);
      }, error => {
        console.log('Nao foi possivel carregar configuração do sistema');
      })
    );

    this.carregarPublicacoesRecentes();

    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
              .subscribe(response => this.titleService.setTitle(response.body + ' - Página inicial'))
    );

    this.tiposDeBusca = this.listarTiposDeBusca();
    this.formGroupSearch = this.fb.group({
      tipoBusca: [EnumValues.getNameFromValue(TipoBusca, 'Título'), Validators.required],
      termoBusca: ['', Validators.required]
    });
    this.pageEvent = new PageEvent();
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;

    // this.carregarSlide();
  }

  private carregarPublicacoesRecentes() {
    this.subscriptions.push(
      this.documentoService.getPublicacoesRecentes(4)
        .subscribe(response => {
          this.recenteList = response.body;
        })
    );
  }

  private carregarSlide(): void {
    // this.sliderElement.emit(this.sliderOptions);
    // ($(this.el.nativeElement) as any).find('.slider').slider(this.sliderOptions);
  }

  listarTiposDeBusca(): any[] {
    return EnumValues.getNamesAndValues(TipoBusca);
  }

  search(): void {
    const label = this.formGroupSearch.value.tipoBusca;
    const termo = this.formGroupSearch.value.termoBusca;
    this.subscriptions.push(
      this.searchService.buscarPorLabel(label, termo, this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe(
        data => {
          this.pageEvent.length = Number(data.headers.get('X-Total-Count'));
          this.results = data.body;
          this.filteredResults = data.body;
          this.atualizarOpcoesDeFiltro();
        }, err => {

        }
      )
    );

  }

  addRelevance(): void {
    const relevance = new QueryRelevance(this.formAddRelevance.value.field, this.formAddRelevance.value.value);
    this.queryVO.queryRelevanceList.push(relevance);
    console.log(this.queryVO);
  }

  estaPresenteNaQuerySearch(field: string): boolean {
    const item = this.queryVO.queryRelevanceList.find(i => i.field === field);
    return item !== undefined;
  }

  removerRelevance(field: string): void {
    const index = this.queryVO.queryRelevanceList.findIndex(i => i.field === field);
    this.queryVO.queryRelevanceList.splice(index, 1);
  }

  searchQuery(): void {
    this.queryVO.searchText = this.formGroupSearchQuery.value.searchValue;
    this.subscriptions.push(
      this.searchService.buscarPorSearchQuery(this.queryVO, this.pageEvent.pageIndex, this.pageEvent.pageSize).subscribe(
        data => {
          this.pageEvent.length = Number(data.headers.get('X-Total-Count'));
          this.results = data.body;
          this.filteredResults = data.body;
          this.atualizarOpcoesDeFiltro();
          this.fecharModal();
        }, err => {

        }
      )
    );
  }

  setEvent(event: PageEvent): void {
    this.pageEvent = event;
    this.search();
  }

  private atualizarOpcoesDeFiltro(): void {
    const todosOsAnos = this.results.map(doc => moment(doc.dataPublicacao.toString()).year());
    const distinctCursosId = [...new Set(this.results.map(doc => doc.curso.id))];
    this.cursosParaFiltrar = distinctCursosId.map(id => this.results.find(doc => doc.curso.id === id).curso);
    const min = Math.min(...todosOsAnos);
    const max = Math.max(...todosOsAnos);
    this.options.floor = min;
    this.options.ceil = max;
    this.minValue = min;
    this.maxValue = max;
  }

  aplicarFiltrar(): void {
    this.loaderService.show();
    if (this.cursoFiltragem.value != null) {
      // filtrar por curso e ano
      this.filteredResults = this.results.filter(doc => {
        const anoDoc = moment(doc.dataPublicacao.toString()).year();
        if (this.cursoFiltragem.value === 'Todos') {
          return anoDoc >= this.minValue && anoDoc <= this.maxValue;
        }
        return doc.curso.id === this.cursoFiltragem.value && (anoDoc >= this.minValue && anoDoc <= this.maxValue);
      });
    } else {
      // filtrar somente por ano
      this.filteredResults = this.results.filter(doc => {
        const anoDoc = moment(doc.dataPublicacao.toString()).year();
        return anoDoc >= this.minValue && anoDoc <= this.maxValue;
      });
    }
    this.loaderService.hide();
  }

  abrirModalBusca() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  fecharModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  tiposDeBuscaFiltrados(): TipoBusca[] {
    return this.tiposDeBusca.filter(i => !this.estaPresenteNaQuerySearch(i.name));
  }
}
