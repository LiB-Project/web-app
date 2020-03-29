import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css']
})
export class SobreComponent implements OnInit, OnDestroy {

  html: string;
  private subscription: Subscription;

  constructor(private configuracaoService: ConfiguracaoService) { }

  ngOnInit() {
    this.subscription = this.configuracaoService.recuperarConfiguracao().subscribe(response => {
      this.html = response.body.htmlPaginaSobre;
    }, error => {
      console.log('Nao foi possivel recuperar o conteudo da pagina sobre');
    });
  }

  ngOnDestroy(): void {
    if (this.subscription != null) { this.subscription.unsubscribe(); }
  }

}
