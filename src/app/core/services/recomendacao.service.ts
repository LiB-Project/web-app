import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpResponse, HttpParams, HttpClient } from '@angular/common/http';
import { Documento } from '../model/documento.model';
import { Recomendacao } from '../model/recomendacao.model';

@Injectable({
  providedIn: 'root'
})
export class RecomendacaoService {

  private URL_RESOURCE = environment.apiBase + environment.recomendacaoPath;

  constructor(private http: HttpClient) { }

  buscarRecomendacoesDeDocumento(document: string): Observable<HttpResponse<Recomendacao[]>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('document', document);
    return this.http.get<Documento[]>(this.URL_RESOURCE, { observe: 'response', params: httpParams});
  }
}
