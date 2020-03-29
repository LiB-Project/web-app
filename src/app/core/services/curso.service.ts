import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Curso } from 'src/app/core/model/curso.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {NivelCurso} from '../model/nivelCurso.enum';

@Injectable({
  providedIn: 'root',
})
export class CursoService {

  private URL_RESOURCE = environment.apiBase + environment.cursoPath;

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<HttpResponse<Curso[]>> {
    return this.http.get<Curso[]>(`${this.URL_RESOURCE}/all`, {observe: 'response'});
  }

  listar(page: number, size: number): Observable<HttpResponse<Curso[]>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page.toString());
    httpParams = httpParams.append('size', size.toString());
    return this.http.get<Curso[]>(this.URL_RESOURCE, {params: httpParams, observe: 'response'});
  }

  cadastrar(curso: Curso): Observable<HttpResponse<Curso>> {
    return this.http.post(this.URL_RESOURCE, curso, {observe: 'response'});
  }

  atualizar(atualizado: Curso): Observable<HttpResponse<Curso>> {
    return this.http.put(`${this.URL_RESOURCE}/${atualizado.id}`, atualizado, { observe: 'response'});
  }

  deletar(id: string): Observable<HttpResponse<any>> {
    return this.http.delete(this.URL_RESOURCE + '/' + id, {observe: 'response'});
  }

  listarPorNivel(nivel: NivelCurso): Observable<HttpResponse<Curso[]>> {
    return this.http.get<Curso[]>(`${this.URL_RESOURCE}/nivel?q=${nivel}`, { observe: 'response' });
  }

}
