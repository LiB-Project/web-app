import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Curso } from 'src/app/core/model/curso.model';
import { Orientador } from 'src/app/core/model/orientador.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrientadorService {

  private URL_RESOURCE = environment.apiBase + environment.orientadorPath;

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<HttpResponse<Orientador[]>>{
    return this.http.get<Orientador[]>(`${this.URL_RESOURCE}/all`, { observe: 'response' });
  }

  listar(page: number, size: number): Observable<HttpResponse<Orientador[]>>{
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.toString());
    httpParams = httpParams.append('size', size.toString());
    return this.http.get<Orientador[]>(this.URL_RESOURCE, { params: httpParams, observe: 'response' });
  }

  cadastrar(orientador: Orientador): Observable<HttpResponse<Orientador>> {
    return this.http.post(this.URL_RESOURCE, orientador, { observe: 'response' });
  }

  atualizar(atualizado: Orientador): Observable<HttpResponse<Orientador>> {
    return this.http.put(this.URL_RESOURCE, atualizado, { observe: 'response' });
  }

  deletar(id: string): Observable<HttpResponse<any>> {
    return this.http.delete(this.URL_RESOURCE + '/' + id, { observe: 'response' });
  }
}
