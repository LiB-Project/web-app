import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Documento } from 'src/app/core/model/documento.model';
import { ToastrService } from 'ngx-toastr';
import { DocumentoService } from 'src/app/core/services/documento.service';
import { Title } from '@angular/platform-browser';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-documento-list',
  templateUrl: './documento-list.component.html',
  styleUrls: ['./documento-list.component.css']
})
export class DocumentoListComponent implements OnInit {

  // pagination items
  pageEvent: PageEvent;

  private subscriptions: Subscription[] = [];
  documentos: Documento[];

  constructor(private service: DocumentoService,
              private toastr: ToastrService,
              private configService: ConfiguracaoService,
              private titleService: Title) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
          .subscribe(response => this.titleService.setTitle(response.body + ' - Gerenciar documentos'))
    );

    this.pageEvent = new PageEvent();
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 15;
    this.carregarDocumentos();
  }

  carregarDocumentos():void{
    this.subscriptions.push(
      this.service.listar(this.pageEvent.pageIndex,this.pageEvent.pageSize)
          .subscribe(
            response =>{
              this.pageEvent.length = Number(response.headers.get('X-Total-Count'));
              this.documentos = response.body;
            }, err=>{

            }
          )
    );
  }

  setEvent(event: PageEvent): void{
    this.pageEvent = event;
    this.carregarDocumentos();
  }

  deletar(id: string):void {
    this.subscriptions.push(
      this.service.deletar(id).subscribe(
        response =>{
          this.carregarDocumentos();
        }, err => {
          this.toastr.error('Erro na exclusão', 'Não foi possível remover o documento');
        }
      )
    );

  }

}
