import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logomarca',
  templateUrl: './logomarca.component.html',
  styleUrls: ['./logomarca.component.css']
})
export class LogomarcaComponent implements OnInit, OnDestroy {

  logomarcaBase64: SafeUrl;
  private subscription: Subscription;

  constructor(private configuracaoService: ConfiguracaoService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.subscription = this.configuracaoService.recuperarLogomarca().subscribe(
      response => {
        this.logomarcaBase64 = this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64, ' + response.body);
      }, error => {
        console.log('Nao foi possivel carregar a logomarca do sistema');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription != null) { this.subscription.unsubscribe(); }
  }

}
