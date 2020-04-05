import { Component, OnInit } from '@angular/core';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Configuracao } from 'src/app/core/model/configuracao.model';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FileInput } from 'ngx-material-file-input';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {

  configuracao: Configuracao = new Configuracao();

  private PREFIX_IMAGE_BASE64 = 'data:image/*;base64, ';
  private subscriptions: Subscription[] = [];

  formConfiguracao = new FormGroup({
    tituloSistema: new FormControl('', Validators.required),
    iconeBase64: new FormControl('', Validators.required),
    logomarcaBase64: new FormControl('', Validators.required),
    faviconBase64: new FormControl('', Validators.required),
    nomeInstituicao: new FormControl('', Validators.required),
    quantidadeNuvemDePalavras: new FormControl(null, Validators.required),
    siglaInstituicao: new FormControl('', Validators.required),
    htmlPaginaSobre: new FormControl('', Validators.required),
    // não são valores requeridos, são usados como auxiliares para preencher o base64
    iconeFileInput: new FormControl(''),
    logomarcaFileInput: new FormControl(''),
    faviconFileInput: new FormControl(''),
  });

  constructor(private configuracaoService: ConfiguracaoService,
              private toastr: ToastrService,
              private router: Router,
              private titleService: Title,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configuracaoService.recuperarTituloAplicacao()
                .subscribe(response => this.titleService.setTitle(response.body + ' - Configuração do sistema'))
    );

    this.subscriptions.push(
      this.formConfiguracao.get('iconeFileInput').valueChanges.subscribe(
        value => {
          const reader = new FileReader();
          reader.readAsDataURL(value.files[0]);
          reader.onloadend = () => {
            this.formConfiguracao.get('iconeBase64').setValue((reader.result as string).split(',')[1]);
          };
        }
      )
    );
    this.subscriptions.push(
      this.formConfiguracao.get('faviconFileInput').valueChanges.subscribe(
        value => {
          const reader = new FileReader();
          reader.readAsDataURL(value.files[0]);
          reader.onloadend = () => {
            this.formConfiguracao.get('faviconBase64').setValue((reader.result as string).split(',')[1]);
          };
        }
      )
    );
    this.subscriptions.push(
      this.formConfiguracao.get('logomarcaFileInput').valueChanges.subscribe(
        value => {
          const reader = new FileReader();
          reader.readAsDataURL(value.files[0]);
          reader.onloadend = () => {
            this.formConfiguracao.get('logomarcaBase64').setValue((reader.result as string).split(',')[1]);
          };
        }
      )
    );

    this.subscriptions.push(
      this.configuracaoService.recuperarConfiguracao().subscribe(
        response => {
          this.configuracao = response.body;
          this.preencherFormGroupComConfiguracao();
        }, error => {
          this.toastr.error('Não foi possível carregar a configuração atual');
        }
      )
    );
  }

  private preencherFormGroupComConfiguracao(): void {
    this.formConfiguracao.get('tituloSistema').setValue(this.configuracao.tituloSistema);
    this.formConfiguracao.get('quantidadeNuvemDePalavras').setValue(this.configuracao.quantidadeNuvemDePalavras);
    this.formConfiguracao.get('iconeBase64').setValue(this.configuracao.iconeBase64);
    this.formConfiguracao.get('logomarcaBase64').setValue(this.configuracao.logomarcaBase64);
    this.formConfiguracao.get('faviconBase64').setValue(this.configuracao.faviconBase64);
    this.formConfiguracao.get('nomeInstituicao').setValue(this.configuracao.nomeInstituicao);
    this.formConfiguracao.get('siglaInstituicao').setValue(this.configuracao.siglaInstituicao);
    this.formConfiguracao.get('htmlPaginaSobre').setValue(this.configuracao.htmlPaginaSobre);
  }

  exibirVisualizacaoDeIcone(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.PREFIX_IMAGE_BASE64 + this.formConfiguracao.get('iconeBase64').value);
  }

  exibirVisualizacaoDeLogomarca(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.PREFIX_IMAGE_BASE64 + this.formConfiguracao.get('logomarcaBase64').value);
  }

  exibirVisualizacaoDeFavicon(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.PREFIX_IMAGE_BASE64 + this.formConfiguracao.get('faviconBase64').value);
  }

  atualizar(): void {
    this.subscriptions.push(
      this.configuracaoService.atualizar(this.configuracao.id, this.formConfiguracao.value)
        .subscribe(
          response => {
            this.configuracao = response.body;
            this.toastr.success('Configuração do sistema atualizada com sucesso!');
            this.router.navigate(['/super/configuracao']);
          }, error => {
            this.toastr.error('Não foi possível atualizar a configuração do sistema');
          }
        )
    );
  }

  restaurarConfiguracao() {
    this.subscriptions.push(
      this.configuracaoService.restaurar()
        .subscribe()
    );
  }
}
