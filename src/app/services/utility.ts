import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, ResponseContentType } from '@angular/http';

@Injectable()
export class UtilityService {    
    results: Object[];
    loading: boolean;

    constructor(private http: Http) {
        this.results = [];
        this.loading = false;
    }

    getData(url, method?) {      
        if (!method || method == 'get') {
            return this.http.get(url)
                .map((res: Response) => res.json());
        }
        else if (method == 'options') {
            return this.http.options(url)
                .map((res: Response) => res.text);
        }
        
    }

    

    getAuthData(url:string, auth) {
       
          var options = new RequestOptions();
          options.headers = new Headers();
          options.headers.append("Authorization", "Basic " + btoa(auth.user + ":" + auth.pswd));
          if (url.endsWith('image'))
              options.responseType = ResponseContentType.ArrayBuffer; 

          return this.http.get(url, options)
              .map((res: Response) => {
                  var ctype = res.headers.get('content-type');
                  if (ctype == 'application/json') {
                      return res.json();
                  }
                  else if (ctype == 'text/html') {
                      return res.text();
                  }
                  else {
                      if (res.headers.get('content-type') == 'image/jpeg') {
                          return res.blob();
                      }
                      else
                          return res.text();
                  }
              });
        
    }

   
    
}
