import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexFill,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTooltip,
  ApexPlotOptions,
  ApexNoData,
  ApexNonAxisChartSeries,
  ApexAnnotations,
  ApexResponsive,
  ApexGrid,
  ApexStates,
  ApexTheme
} from "ng-apexcharts";

export type ChartOptions = {  
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis | ApexYAxis[];
  fill: ApexFill;
  stroke: any; //ApexStroke;
  markers: any; //ApexMarkers;
  colors: string[];
  labels: any[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  noData: ApexNoData;
  annotations: ApexAnnotations;
  responsive: ApexResponsive[];
  grid: ApexGrid;
  states: ApexStates;
  theme: ApexTheme;
};