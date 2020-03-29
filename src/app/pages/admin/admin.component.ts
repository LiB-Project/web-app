import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import {filter, map} from 'rxjs/operators';
import { UserStorageService } from 'src/app/core/services/user-storage.service';
import { Title } from '@angular/platform-browser';
import { UserAuthorization } from 'src/app/core/model/user-authorization';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';
import {BreadCrumb} from '../../core/value/bread-crumb.value';

@Component({
  selector: 'child-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user: UserAuthorization;
  textIcon = 'AD'; // value default
  routeObservable: Observable<ActivatedRoute>;
  itensLocalizacao: BreadCrumb[] = [];
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  private subscriptions: Subscription[] = [];

  constructor(private breakpointObserver: BreakpointObserver,
              private configService: ConfiguracaoService,
              private userStorageService: UserStorageService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private titleService: Title
    ) {
    this.observePageNameDinamically();
  }

  private observePageNameDinamically(): void {
    this.routeObservable = this.router.events.pipe(
      filter(routeEvent => routeEvent instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((active) => {
        while (active.firstChild) { active = active.firstChild; }
        return active;
      })
    );

    this.subscriptions.push(
      this.routeObservable.subscribe((activateRouteFinal) => {
        this.preencherItensParaMapaDeLocalizacao(activateRouteFinal);
      })
    );
  }


  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
        .subscribe(response => this.titleService.setTitle(response.body + ' - Administração'))
    );

    this.user = new UserAuthorization();
    const user = this.userStorageService.getUserAuthorization();
    if (user != null) {
      this.user.login = user.login;
      this.user.nome = user.nome;
      this.getTextIconCircle();
    }
  }
  fazerLoggout(): void {
    this.userStorageService.signOut();
    this.router.navigate(['login']);
  }

  private getTextIconCircle(): void {
    const arr = this.user.nome.split(' ');
    if (arr.length > 1) {
      this.textIcon = arr[0].substr(0, 1) + arr[1].substr(0, 1);
    }
  }

  private preencherItensParaMapaDeLocalizacao(activeFinal: ActivatedRoute): void {
    this.itensLocalizacao = [];
    activeFinal.pathFromRoot
      .filter(value => value.snapshot != null)
      .forEach(route => {
        // montando URL
        const url = route.pathFromRoot
          .map(value => value.snapshot.url.join('/'))
          .filter(value => value != null && value !== '')
          .join('/');

        // recuperando label a partir de pageName
        this.subscriptions.push(
          route.data.subscribe(data => {
            if (data.pageName != null) {
              const isPresent = this.itensLocalizacao.some(item => item.label === data.pageName);
              if (!isPresent) { this.itensLocalizacao.push(new BreadCrumb(data.pageName, `/${url}`)); }
            }
          })
        );
      });
  }


}
