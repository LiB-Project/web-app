import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ConfiguracaoService } from 'src/app/core/services/configuracao.service';

@Component({
  // tslint:disable-next-line: component-selector
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeSuperUserComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  constructor(private titleService: Title,
              private configService: ConfiguracaoService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.configService.recuperarTituloAplicacao()
                .subscribe(response => this.titleService.setTitle(response.body + ' - Super usuário'))
    );
  }

}
