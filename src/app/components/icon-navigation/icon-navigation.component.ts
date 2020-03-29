import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-icon-navigation',
  templateUrl: './icon-navigation.component.html',
  styleUrls: ['./icon-navigation.component.css']
})
export class IconNavigationComponent implements OnInit, OnDestroy {

  tituloSistema: string;
  iconBase64: SafeUrl;
  private subscription: Subscription;

  constructor(private configuracaoService: ConfiguracaoService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.subscription = this.configuracaoService.recuperarConfiguracao().subscribe(
      response => {
        this.tituloSistema = response.body.tituloSistema;
        this.iconBase64 = this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64, ' + response.body.iconeBase64);
      }, error => {
        console.log('Nao foi possivel carregar o icone do sistema');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription != null) { this.subscription.unsubscribe(); }
  }

}
