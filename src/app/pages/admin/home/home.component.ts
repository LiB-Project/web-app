import {Component, OnDestroy, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {UserAuthorization} from '../../../core/model/user-authorization';
import {UserStorageService} from '../../../core/services/user-storage.service';
import {DocumentoAcessos} from '../../../core/value/documento-acessos.value';
import {EstatisticaService} from '../../../core/services/estatistica.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  user: UserAuthorization;
  acessos: DocumentoAcessos[] = [];

  constructor(private userStorageService: UserStorageService,
              private estatisticaService: EstatisticaService) { }

  ngOnInit() {
    this.user = this.userStorageService.getUserAuthorization();

    this.subscriptions.push(
      this.estatisticaService.carregarQuantidadeAcessos()
        .subscribe(response => {
          this.acessos = response.body;
        })
    );

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
