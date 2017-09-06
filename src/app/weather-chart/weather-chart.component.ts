import { Component, OnInit } from '@angular/core';
import Archive from '../classes/Archive';
import { WeatherService } from '../services/weather';
import * as Graphs from '../classes/GraphSet';
import * as moment from 'moment';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';

@Component({
  selector: 'app-weather-chart',
  templateUrl: './weather-chart.component.html',
  styleUrls: ['./weather-chart.component.css'],
  providers: [WeatherService]
})
export class WeatherChartComponent implements OnInit {

    constructor(private webService: WeatherService) { }
    monthName: string;
    public dataSets: Array<Graphs.GraphSet>;
    public lineChartData: Array<Graphs.GraphItem>;
    public lineChartLabels: Array<string>;
    public lineChartOptions: any;
    public lineChartOptions0: any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                    suggestedMin: 50
                }
            }],
            xAxes: [{
                ticks: {
                    callback: (value, index, values) => {
                        if (this.viewType == 'Monthly') {
                            value = moment(value, 'MM/DD/YYYY').format('MMM');                                
                        }
                        return value;
                    }
                }
            }]
        }
    };
    public lineChartOptions1: any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                    suggestedMin: 0,
                    suggestedMax: .5
                }
            }]
        }
    };
    public lineChartColors: Array<any> = [
    ];

    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';
    public chartIndex: number = 0;
    public chartSet: Graphs.GraphSet;

    public dtPicker: DateModel;
    public dtPickerOpt: DatePickerOptions;
    public viewType: string;

    ngOnInit() {
        this.viewType = 'Hourly';
        this.dataSets = new Array<Graphs.GraphSet>();
        var graphSet = new Graphs.GraphSet();
        graphSet.addItem('Temperature', 'temperature');
        graphSet.addItem('Dewpoint', 'dewpoint');
        graphSet.minimum = 50;
        this.dataSets.push(graphSet);

        graphSet = new Graphs.GraphSet();
        graphSet.addItem('Rain Rate', 'rainRate');
        graphSet.addItem('Rain Total', 'rainTotal');
        graphSet.addItem('Rain Aggregate', 'rainAggr');
        graphSet.minimum = 0;
        graphSet.beginAtZero = true;
        this.dataSets.push(graphSet);

        var graphSet = new Graphs.GraphSet();
        graphSet.addItem('High Temperature', 'maxTemp');
        graphSet.addItem('Low Temperature', 'minTemp');
        graphSet.addItem('Avg Temperature', 'avgTemp');
        graphSet.minimum = 50;
        this.dataSets.push(graphSet);

        graphSet = new Graphs.GraphSet();
        graphSet.addItem('Rain Total', 'rainTotal');
        graphSet.addItem('Rain Aggregate', 'rainAggr');
        graphSet.minimum = 0;
        graphSet.beginAtZero = true;
        this.dataSets.push(graphSet);

        this.dtPicker = new DateModel();
        this.formatDate(moment().startOf('day'));
        this.dtPickerOpt = new DatePickerOptions();
        this.dtPickerOpt.maxDate = this.dtPicker.momentObj.toDate();
        this.dtPickerOpt.initialDate = this.dtPickerOpt.maxDate;
        this.dtPickerOpt.format = 'MM/DD/YYYY';

        this.chartSet = this.dataSets[this.chartIndex];
        this.lineChartOptions = this['lineChartOptions' + this.chartIndex.toString()];

        this.loadGraph();
    }

    chartClicked(e) {
        if (this.chartIndex < this.dataSets.length - 1) {
            this.chartIndex += 1;
        }
        else {
            this.chartIndex = 0;
        }

        this.setChart();
    }

    handleDateChange(e) {
        if (e.type == 'dateChanged') {

            this.formatDate(e.data.momentObj);
            this.loadGraph();
        }
    }

    formatDate(momentObj) {
        this.dtPicker.momentObj = momentObj;
        this.dtPicker.formatted = momentObj.format('MM/DD/YYYY');
    }

    previousDay() {
        this.formatDate(this.dtPicker.momentObj.add(-1, 'days'));
        this.loadGraph();
    }

    nextDay() {
        if (this.dtPicker.momentObj.unix() < moment().startOf('day').unix()) {
            this.formatDate(this.dtPicker.momentObj.add(1, 'days'));
            this.loadGraph();
        }

    }

    setChart() {

        this.chartSet = this.dataSets[this.chartIndex];
        if (this.viewType != 'Hourly')
            this.chartSet = this.dataSets[this.chartIndex + 2];

        var chartIndex = this.chartIndex < 2 ? this.chartIndex : this.chartIndex - 2;

        var options = this['lineChartOptions' + chartIndex];
        var opt = options.scales.yAxes[0].ticks;
        opt.suggestedMin = this.chartSet.minimum;
        opt.beginAtZero = this.chartSet.beginAtZero;
        this.lineChartOptions = null;
        this.lineChartData = this.chartSet.items;

        setTimeout(() => { this.lineChartOptions = options; }, 100);

    }

    switchView() {
        if (this.viewType == 'Hourly')
            this.viewType = 'Daily';
        else if (this.viewType == 'Daily')
            this.viewType = 'Monthly';
        else
            this.viewType = 'Hourly';

        this.loadGraph();
    }

    loadGraph() {
        var hr = new Number(moment().format('HH'));
        var day00 = moment().startOf('day').unix();
        if (this.dtPicker.momentObj.unix() != day00) {
            hr = 23;
        }

        this.lineChartLabels = new Array<string>();
        var dataSet = new Array<any>();         

        this.dataSets.forEach(ds => {
            ds.clear();
        });

        var period;
        switch (this.viewType) {
            case 'Hourly':
                period = 'days';
                break;
            case 'Daily':
                period = 'months';
                break;

            case 'Monthly':
                period = 'years';
                break;
        }


        this.webService.getArchives(this.dtPicker.momentObj.format('MM/DD/YYYY'), period).subscribe(archives => {

            var rainAggr = 0;
            var rainRate = 0;
            var minTemp = null;
            var last = archives[archives.length - 1];

            archives.forEach((arch: Archive) => {
                arch.dewpoint = this.getDewpoint(arch.temperature, arch.humidity);
                rainAggr += arch.rainClicks / 100;
                arch['rainAggr'] = this.round(rainAggr, 2);
                arch.rainTotal = arch.rainClicks / 100;

                if (arch.temperature < minTemp || minTemp == null)
                    minTemp = arch.temperature;

                if (period == 'months')
                    arch['_id'].archiveTime = arch['_id'].archiveTime.substr(0, 5);

                this.dataSets.forEach((set: Graphs.GraphSet) => {
                    set.addData(arch);
                });

                this.lineChartLabels.push(arch['_id'].archiveTime);
            });

            this.chartSet.minimum = minTemp - 2;
            this.setChart();

        });
    }

    getDewpoint(temperature: number, rh: number): number {
        var dewPt = 0;

        try {
            var tem = -1.0 * temperature;
            var es = 6.112 * Math.exp(-1.0 * 17.67 * tem / (243.5 - tem));
            var ed = rh / 100.0 * es;
            var eln = Math.log(ed / 6.112);
            dewPt = -243.5 * eln / (eln - 17.67);
        }
        catch (ex) {
            console.log("getDewpoint:" + ex);
        }

        return Math.round(dewPt * 100) / 100;
    }

    round(nbr, decimals) {
        if (typeof nbr == 'string') {
            nbr = parseFloat(nbr);
        }
        if (!decimals) {
            decimals = 0;
        }
        return parseFloat(nbr.toFixed(decimals));
    }  

}
