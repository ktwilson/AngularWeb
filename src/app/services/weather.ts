import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, ResponseContentType, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {
  constructor(
    private http: Http
    ) { }

  getArchives(dtStart, period) {
    let params = new URLSearchParams();
    params.set('dt', dtStart);
    params.set('period', period);
    
    var options = new RequestOptions();
    options.search = params;

    return this.http.get('http://smart-app.live/vpdata/archives', options)
            .map((res: Response) => res.json());
    }

  getCurrent() {
    return this.http.get('http://smart-app.live/vpdata/current')
            .map((res: Response) => res.json());
    }

}
