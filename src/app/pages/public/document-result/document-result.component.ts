import { Component, OnInit, Input } from '@angular/core';
import { Documento } from 'src/app/core/model/documento.model';

@Component({
  selector: 'document-result',
  templateUrl: './document-result.component.html',
  styleUrls: ['./document-result.component.css']
})
export class DocumentResultComponent implements OnInit {

  @Input() documento: Documento;


  constructor() { }

  ngOnInit() {
  }

}
