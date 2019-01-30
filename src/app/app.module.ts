import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { WeatherChartComponent } from './weather-chart/weather-chart.component';
import { LiveWeatherComponent } from './live-weather/live-weather.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { DatePickerModule } from 'ng2-datepicker';
import { DashboardComponent } from './dashboard/dashboard.component';

const ROUTES = [
  {
    path: '',
    redirectTo: 'weather',
    pathMatch: 'full'
  },
  {
    path: 'weather',
    component: LiveWeatherComponent
  },  
  {
    path: 'services',
    component: DashboardComponent
  },
  {
    path: 'weatherchart',
    component: WeatherChartComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    WeatherChartComponent,
    LiveWeatherComponent,    
    DashboardComponent   
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    ChartsModule,
    HttpModule,
    JsonpModule,
    DatePickerModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
