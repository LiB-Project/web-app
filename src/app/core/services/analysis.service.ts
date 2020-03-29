import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Frequency } from '../model/frequency.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {

  private URL_RESOURCE = environment.apiBase + environment.analysisPath;

  constructor(private http: HttpClient) { }

  getFrequencyByDocumentId(idDocument: string): Observable<HttpResponse<Frequency>>{
    return this.http.get<Frequency>(`${this.URL_RESOURCE}/${idDocument}`, {observe: 'response'});
  }

}
