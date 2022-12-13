import { Component, OnInit } from '@angular/core';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexGrid,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: any;
  dataLabels: ApexDataLabels;
  fill: any;
  colors: any;
  title: ApexTitleSubtitle;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: any;

  constructor() {
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
        background: '#2b2b2b00',
        width: '400px',
      },
      labels: ['Turma A', 'Turma B', 'Turma C', 'Turma D', 'Turma E'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
              height: '100%',
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      theme: {
        mode: 'dark', // upto palette10
        palette: 'palette10',
      },
    };

    this.chartOptions2 = {
      theme: {
        mode: 'dark', // upto palette10
        palette: 'palette10',
      },
      series: [
        {
          name: 'Turma A',
          data: this.generateData(8, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: 'Turma B',
          data: this.generateData(8, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: 'Turma C',
          data: this.generateData(8, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: 'Turma D',
          data: this.generateData(8, {
            min: 0,
            max: 90,
          }),
        },
        {
          name: 'Turma E',
          data: this.generateData(8, {
            min: 0,
            max: 90,
          }),
        },
      ],
      chart: {
        height: 200,
        type: 'heatmap',
        background: '#2b2b2b00',
        width: '600px',
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: 'category',
        categories: [
          'Questão 1',
          'Questão 2',
          'Questão 3',
          'Questão 4',
          'Questão 5',
          'Questão 6',
          'Questão 7',
          'Questão 8',
        ],
      },
      grid: {
        padding: {
          right: 20,
        },
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          useFillColorAsStroke: true,
        },
      },
    };
  }

  ngOnInit(): void {}

  public generateData(count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push(y);
      i++;
    }
    return series;
  }
}
