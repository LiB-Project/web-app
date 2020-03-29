import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const WordCloud = require('highcharts/modules/wordcloud');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
WordCloud(Highcharts);

@Component({
  selector: 'cloud-words',
  templateUrl: './cloud-words.component.html',
  styleUrls: ['./cloud-words.component.css']
})
export class CloudWordsComponent implements OnInit {

  @Input('data') data: Array<any>;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
    const map = this.data.map((value) => {
      return {
        name: value.word,
        weight: value.quantity
      }
    });
    console.log(map);
    Highcharts.chart('container', {
      credits:{
        enabled: false
      },
      series: [{
        type: 'wordcloud',
        data: map,
        name: 'Ocorrências',
        placementStrategy: 'random'
      }],
      title: {
        text: ''
      }
    });

  }

}
