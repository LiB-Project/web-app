import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Configuracao } from '../model/configuracao.model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  private URL_RESOURCE = environment.apiBase + environment.configuracaoPath;

  constructor(private http: HttpClient) {
  }

  cadastrar(configuracao: Configuracao): Observable<HttpResponse<Configuracao>> {
    return this.http.post(this.URL_RESOURCE, configuracao, {observe: 'response'});
  }

  atualizar(id: string, configuracao: Configuracao): Observable<HttpResponse<Configuracao>> {
    return this.http.put(`${this.URL_RESOURCE}/${id}`, configuracao, { observe: 'response' });
  }

  recuperarConfiguracao(): Observable<HttpResponse<Configuracao>> {
    return this.http.get(this.URL_RESOURCE, {observe: 'response'});
  }

  recuperarTituloAplicacao(): Observable<HttpResponse<string>> {
    return this.http.get(`${this.URL_RESOURCE}/tituloSistema`, {observe: 'response', responseType: 'text'});
  }

  recuperarFavicon(): Observable<HttpResponse<string>> {
    return this.http.get(`${this.URL_RESOURCE}/faviconBase64`, {observe: 'response', responseType: 'text'});
  }

  recuperarLogomarca(): Observable<HttpResponse<string>> {
    return this.http.get(`${this.URL_RESOURCE}/logomarcaBase64`, {observe: 'response', responseType: 'text'});
  }

  recuperarIcone(): Observable<HttpResponse<string>> {
    return this.http.get(`${this.URL_RESOURCE}/iconeBase64`, {observe: 'response', responseType: 'text'});
  }

  restaurar(): Observable<HttpResponse<null>> {
    return this.http.post<null>(`${this.URL_RESOURCE}/restaurar`, { observe: 'response' });
  }
}
