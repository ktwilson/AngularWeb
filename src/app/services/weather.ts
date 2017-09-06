import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {
    constructor(
        private http: Http
    ) { }

    getArchives(dtStart, period) {
        return this.http.get('http://smart-app.live/vpws/archives?dt=' + dtStart + '&period=' + period)
            .map((res: Response) => res.json());
    }

}