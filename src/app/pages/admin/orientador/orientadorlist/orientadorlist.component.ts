import { CadastroOrientadorComponent } from '../cadastro-orientador/cadastro-orientador.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Orientador } from 'src/app/core/model/orientador.model';
import { Subscription } from 'rxjs';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { EditOrientadorComponent } from '../edit-orientador/edit-orientador.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrientadorService } from 'src/app/core/services/orientador.service';
import { Title } from '@angular/platform-browser';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  selector: 'app-list-orientador',
  templateUrl: './orientadorlist.component.html',
  styleUrls: ['./orientadorlist.component.css']
})
export class OrientadorListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  orientadores: Orientador[];
  // pagination items
  pageEvent: PageEvent;

  constructor(private router: Router,
              private service: OrientadorService,
              public dialog: MatDialog,
              private configService: ConfiguracaoService,
              private toastr: ToastrService,
              private titleService: Title) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
              .subscribe(response => this.titleService.setTitle(response.body + ' - Gerenciar orientadores'))
    );

    this.pageEvent = new PageEvent();
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 15;
    this.carregarOrientadores();
  }

  carregarOrientadores() {
    this.subscriptions.push(
      this.service.listar(this.pageEvent.pageIndex, this.pageEvent.pageSize)
                .subscribe(response => {
                  this.pageEvent.length = Number(response.headers.get('X-Total-Count'));
                  this.orientadores = response.body;
                })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  abrirCadastro() {
    const dialogRef = this.dialog.open(CadastroOrientadorComponent, {
      height: '390px',
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.toastr.error('Erro no cadastro', result);
      }
      this.carregarOrientadores();
    });
  }

  abrirEdicao(orientador: Orientador) {
    const dialogRef = this.dialog.open(EditOrientadorComponent, {
      height: '390px',
      width: '350px',
      data: { orientador: `${JSON.stringify(orientador)}` },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.toastr.error('Erro na edição', result);
      }
      this.carregarOrientadores();
    });

  }

  deletar(id: string) {
    this.subscriptions.push(this.service.deletar(id).subscribe(
      data => {
        this.carregarOrientadores();
      },
      err => {
        this.toastr.error('Erro na exclusão', 'Não foi possível remover o orientador');
      }
    ));
  }

  setEvent(event: PageEvent): void {
    this.pageEvent = event;
    this.carregarOrientadores();
  }

}
