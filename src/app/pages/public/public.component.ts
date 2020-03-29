import {Component, ElementRef, EventEmitter, OnInit, Renderer2} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import {filter, map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BreadCrumb} from '../../core/value/bread-crumb.value';


@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {

  sideNavActions = new EventEmitter<any | MaterializeAction>();
  private subscriptions: Subscription[] = [];
  routeObservable: Observable<ActivatedRoute>;
  itensLocalizacao: BreadCrumb[] = [];

  constructor(private el: ElementRef,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
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


  ngOnInit() {
    this.carregarSideNav();
  }

  private carregarSideNav(): void {
    ($(this.el.nativeElement) as any).find('.button-collapse').sideNav();
  }

  abrirSideNav() {
    this.sideNavActions.emit({ action: 'sideNav', params: ['show'] });
  }
  fecharSideNav() {
    ($(this.el.nativeElement) as any).find('.button-collapse').sideNav('hide');
  }

}
