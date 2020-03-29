import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Documento } from 'src/app/core/model/documento.model';
import { DocumentoService } from 'src/app/core/services/documento.service';
import { Subscription } from 'rxjs';
import { AnalysisService } from 'src/app/core/services/analysis.service';
import { Frequency } from 'src/app/core/model/frequency.model';
import { RecomendacaoService } from 'src/app/core/services/recomendacao.service';
import { Recomendacao } from 'src/app/core/model/recomendacao.model';

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


  constructor(private route: ActivatedRoute,
              private documentoService: DocumentoService,
              private recomendacaoService: RecomendacaoService,
              private analysisService: AnalysisService) { }

  ngOnInit() {
    this.subscriptions.push(this.route.paramMap.subscribe(params => {
      this.subscriptions.push(
        this.documentoService.getById(params.get('documentId')).subscribe(
          data => {
            this.document = data.body;
            this.carregarRecomendacoes();
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


}
