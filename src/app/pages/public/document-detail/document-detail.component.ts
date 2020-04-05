import {Component, OnInit, OnDestroy, ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Documento } from 'src/app/core/model/documento.model';
import { DocumentoService } from 'src/app/core/services/documento.service';
import { Subscription } from 'rxjs';
import { AnalysisService } from 'src/app/core/services/analysis.service';
import { Frequency } from 'src/app/core/model/frequency.model';
import { RecomendacaoService } from 'src/app/core/services/recomendacao.service';
import { Recomendacao } from 'src/app/core/model/recomendacao.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {EstatisticaService} from '../../../core/services/estatistica.service';

@Component({
  selector: 'document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit, OnDestroy{

  document: Documento = new Documento();
  frequency: Frequency;
  private subscriptions: Subscription[] = [];
  recomendacoesList: Recomendacao[] = [];
  slideConfig = {slidesToShow: 3, slidesToScroll: 4};


  constructor(private route: ActivatedRoute,
              private element: ElementRef,
              private sanitizer: DomSanitizer,
              private documentoService: DocumentoService,
              private estatisticaService: EstatisticaService,
              private recomendacaoService: RecomendacaoService,
              private analysisService: AnalysisService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.route.paramMap.subscribe(params => {
      this.subscriptions.push(
        this.documentoService.getById(params.get('documentId')).subscribe(
          data => {
            this.document = data.body;
            this.carregarRecomendacoes();
            this.countAcesso(this.document.id);
          }, err => {

          }
        )
      );
      this.subscriptions.push(
        this.analysisService.getFrequencyByDocumentId(params.get('documentId')).subscribe(
          data => {
            this.frequency = data.body;
          }, err => {

          }
        )
      );
    }));
  }

  countAcesso(idDocument: string): void {
    this.subscriptions.push(
      this.estatisticaService.countAcesso(idDocument).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private carregarRecomendacoes(): void {
    this.subscriptions.push(
      this.recomendacaoService.buscarRecomendacoesDeDocumento(this.document.id).subscribe(
        (response) => {
          this.recomendacoesList = response.body;
          console.log(this.recomendacoesList);
        }, (error) => {
          console.log('Nao foi possivel carregar as recomendacoes');
        }
      )
    );
  }

  getFilePdf(file: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl('data:application/pdf;base64, ' + file);
  }


}
