import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SubArea } from 'src/app/core/model/sub-area.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubAreaService {

  private URL_RESOURCE = environment.apiBase + environment.subAreaPath;

  constructor(private http: HttpClient) { }

  listar(): Observable<HttpResponse<SubArea[]>> {
    return this.http.get<SubArea[]>(this.URL_RESOURCE, { observe: 'response' });
  }
}
