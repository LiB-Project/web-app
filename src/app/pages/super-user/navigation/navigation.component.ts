import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {filter, map, share} from 'rxjs/operators';
import { UserStorageService } from 'src/app/core/services/user-storage.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BreadCrumb} from '../../../core/value/bread-crumb.value';

@Component({
  selector: 'app-super-user-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  routeObservable: Observable<ActivatedRoute>;
  itensLocalizacao: BreadCrumb[] = [];

  HOME_URL = '/super';
  isPageHome = false;

  constructor(private breakpointObserver: BreakpointObserver,
              private userStorageService: UserStorageService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.observePageNameDinamically();
  }

  ngOnInit(): void {
    this.isPageHome = this.router.url === this.HOME_URL;
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

  fazerLoggout(): void {
    this.userStorageService.signOut();
    this.router.navigate(['login']);
  }
}
