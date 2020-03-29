import {Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, OnDestroy} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { ConfiguracaoService } from './core/services/configuracao.service';
import { DOCUMENT } from '@angular/common';
import {Observable, Subscription} from 'rxjs';
import {LocalizacaoService} from './core/services/localizacao.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  routeObservable: Observable<ActivatedRoute>;

  title = 'front-end';

  // tslint:disable-next-line:variable-name
  constructor(private _router: Router,
              // tslint:disable-next-line:variable-name
              @Inject(DOCUMENT) private _document: HTMLDocument,
              private sanitizer: DomSanitizer,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private localizacaoService: LocalizacaoService,
              private configService: ConfiguracaoService) {
  }


  ngOnInit() {
    // tslint:disable-next-line:only-arrow-functions
    this._router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this._router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
            this._router.navigated = false;
            window.scrollTo(0, 0);
        }
    });

    this.definirFaviconDaAplicacao();
  }

  private definirFaviconDaAplicacao(): void {
    this.configService.recuperarFavicon().subscribe(
      response => {
        const faviconBase64 = response.body;
        const data = 'data:image/x-icon;base64,' + faviconBase64;
        this._document.getElementById('favicon').setAttribute('href', data);
      }, error => {
        console.log('Nao foi possivel carregar o favicon da aplicacao');
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
