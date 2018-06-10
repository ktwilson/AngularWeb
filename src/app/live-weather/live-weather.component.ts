import { Component, OnInit } from '@angular/core';
import Current from '../classes/Current';
import io from 'socket.io-client';
import { WeatherChartComponent } from '../weather-chart/weather-chart.component';
import { Title } from '@angular/platform-browser';
import { WeatherService } from '../services/weather';

@Component({
  selector: 'app-live-weather',
  templateUrl: './live-weather.component.html',
  styleUrls: ['./live-weather.component.css'],
  providers: [WeatherService]
})
export class LiveWeatherComponent implements OnInit {

    vm: any;
    wsocket: any;
    alerts: any;
    forecast: any;
    lastUpdate: any;
    lastDateLoaded: any;
    heatIndex: number;
    title: string;


    constructor(private webService: WeatherService, private titleService: Title) {
       
    }

    ngOnInit() {
        this.titleService.setTitle("Sourek Trail Weather");
        this.vm = {
            forecast: {},
            today: {},
            yesterday: {}            
        };

        this.checkService();
        setInterval(() => { this.updatedSeconds() }, 1000);

    }

    connectWS(useVpws) {        

        try {
          var hostname = useVpws ? 'http://smart-app.live' : 'http://smart-app.live:9000';            

            console.log('hostname ' + hostname);
            var options: any = { query: { client: "wsclient" } };

            if (useVpws)
                options.path = '/vpws/socket.io';

            this.wsocket = io(hostname, options);

            this.wsocket.on('connect', () => {
                console.log('ws connected');
            });

            this.wsocket.on('current', data => {
                this.vm.poweredBy = 'ws';
                if (typeof (data) == 'string')
                    data = JSON.parse(data)
                this.updateCurrent(data);

            });

            this.wsocket.on('hilows', data => {
                this.vm.poweredBy = 'ws';
                var evnt;
                var hilows = data;
                if (typeof (data) == 'string')
                    hilows = JSON.parse(data);

                this.updateDaily(hilows);

            });

            this.wsocket.on('alerts', (data) => {
                if (data && data.length) {
                    this.alerts = JSON.parse(data)[0];                    
                }
            });

            this.wsocket.on('connect_error', (err)=> {
                this.connectWS(false);
            });

        }
        catch (e) {
            console.log('socket error:' + e);
        }

    }

    checkService() {
        this.webService.getCurrent().subscribe(current => {
            this.connectWS(false);
        }, err => {
            this.connectWS(true);
        });
    }

    updateCurrent(current) {

        if (current.stormDate)
            current.stormDate = this.getDate(current.stormDate).toLocaleDateString();

        this.vm.windDirCSS = this.rotateCSS(this.vm.windDir);

        Object.assign(this.vm, current);



        try {
            this.heatIndex = Math.round(this.getHeatIndex(current.temperature, current.humidity));
        }
        catch (x) { }

        this.lastDateLoaded = new Date();

    }


    updateAlerts(data) {
        var vm = this;
        console.log(data);
        if (data && data.length)
            vm.alerts = data[0].message;
    }

    updateDaily(hilows) {
        this.vm.forecast = {};


        if (hilows.forecast) {
          var fcast = hilows.forecast.periods;
          if (fcast[0].fcttext) {
            this.vm.forecast.today = fcast[0].fcttext;
            this.vm.forecast.icon = fcast[0].icon_url;
            this.vm.forecast.tonight = fcast[1].fcttext;
            this.vm.forecast.tomorrow = fcast[2].fcttext;
          }
        }       

        this.vm.today = {
            HiTemp: hilows.temperature.dailyHi, LowTemp: hilows.temperature.dailyLow,
            HiTempTime: hilows.temperature.dailyHighTime, LowTempTime: hilows.temperature.dailyLowTime,
            HiWind: hilows.windSpeed.dailyHi,
            HiWindTime: hilows.windSpeed.dailyHighTime,
            hourRain: hilows.rain1hour / 100
        };

        if (isNaN(this.vm.today.hourRain))
            this.vm.today.hourRain = 0;

        //vm.yesterday = daily.Yesterday;
        //vm.forecast = forecast;


        //updateAlerts(daily.NWSAlerts);

    }

    rotateCSS(degrees) {
        var rotate = "rotate(" + degrees + "deg)";

        var css = {
            '-webkit-transform': rotate,
            transform: rotate,
            'ms-transform': rotate,
            mozTransform: rotate
        };

        return css;
    }

    getDate(datestr) {
        var dt;

        if (datestr.substr(0, 5) == "/Date")
            dt = new Date(parseInt(datestr.substr(6)));
        else
            dt = new Date(datestr);

        return dt;


    }

    updatedSeconds() {
        if (!this.lastDateLoaded)
            return '';
        var now: any = new Date();
        var diff = Math.abs(now - this.lastDateLoaded);
        var seconds = Math.floor(diff / 1000);
        var minutes = Math.floor(seconds / 60);
        //seconds = seconds % 60;
        var hours = Math.floor(minutes / 60);
        minutes = minutes % 60;

        this.vm.lastUpdate = seconds;
        return seconds;
    }

    getHeatIndex(temp, humidity): number {
        var heatIndex = 0.5 * (temp + 61 + (temp - 68) * 1.2 + humidity * 0.094);
        if (temp >= 80) {
            var heatIndexBase = (-42.379 +
                2.04901523 * temp +
                10.14333127 * humidity +
                -0.22475541 * temp * humidity +
                -0.00683783 * temp * temp +
                -0.05481717 * humidity * humidity +
                0.00122874 * temp * temp * humidity +
                0.00085282 * temp * humidity * humidity +
                -0.00000199 * temp * temp * humidity * humidity);
            // adjustment
            if (humidity < 13 && temp <= 112) {
                heatIndex = heatIndexBase - (13 - humidity) / 4 * Math.sqrt((17 - Math.abs(temp - 95)) / 17);
            } else if (humidity > 85 && temp <= 87) {
                heatIndex = heatIndexBase + ((humidity - 85) / 10) * ((87 - temp) / 5)
            } else {
                heatIndex = heatIndexBase;
            }
        }

        return heatIndex;
    }

}
