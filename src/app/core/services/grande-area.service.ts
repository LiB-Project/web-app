import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrandeArea } from 'src/app/core/model/grande-area.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GrandeAreaService {

  private URL_RESOURCE = environment.apiBase + environment.grandeAreaPath;

  constructor(private http: HttpClient) { }

  listar(): Observable<HttpResponse<GrandeArea[]>>{
    return this.http.get<GrandeArea[]>(this.URL_RESOURCE, { observe: 'response' });
  }
}
