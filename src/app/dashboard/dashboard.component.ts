import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { UtilityService } from '../services/utility';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UtilityService]
})
export class DashboardComponent implements OnInit {
    vantagejs = { name: "VantageJS", class: "panel-default",icon:'', path:'vpws', url:'http://smart-app.live/' }
    socketSrv = { name: "Sockets", class: "panel-default", icon: '', path: 'http://smart-app.live:9000' }
    garDoor = { name: "Garage", class: "panel-default", icon:'', path:'gdoor/status'}
    shpDoor = { name: "Shop", class: "panel-default" ,icon:'', path:'shop/status'}
    fi9803p = { name: "FI9803P", class: "panel-default", icon: '', path:'gdoor/image' }
    acPower = { name: "AC Power", class: "panel-default", iconclass: 'fa fa-bolt', path:'power'}

    services: Array<any>;
    authRequired: boolean;
    credentials: any;

    constructor(private webService: UtilityService, private sanitizer: DomSanitizer, private titleService: Title) {
        this.titleService.setTitle("Services");
        var auth: any = this.getCookie('auth');     
        this.credentials = { user: null, pswd: null };

        if (auth) {
            this.credentials = JSON.parse(auth);         
        }

        this.authRequired = !this.credentials || !this.credentials.user;
        this.services = [this.vantagejs, this.socketSrv, this.garDoor, this.shpDoor, this.fi9803p, this.acPower];
        
    }

    ngOnInit() {
        this.getStatuses();        

        setInterval(this.getStatuses(), 60000);
  }

    getStatuses() {
        this.getService(this.vantagejs);
        this.getWebSocket(this.socketSrv);
        this.getAuthService(this.fi9803p);
        this.getAuthService(this.garDoor);
        this.getAuthService(this.shpDoor);
        this.getService(this.acPower);
  }  

    getWebSocket(svc) {
        svc.url = svc.path;

        try {
            var hostname = svc.path;
            var wsocket = io(hostname, { query: { client: "wsclient" } });

            wsocket.on('connect', () => {
                svc.class = 'panel-primary';
                svc.display = 'connected';
            });

            wsocket.on('error', () => {
                svc.class = 'panel-danger';
            });

            wsocket.on('current', current => {
                if (typeof current == 'string')
                    current = JSON.parse(current);
                svc.display = new Date(current.dateLoaded).toLocaleTimeString();
            });


        }
        catch (e) {
            console.log('socket error:' + e);
        }
  }

  getAuthService(svc) {     
      
      var url = 'https://smart-app.live/' + svc.path;
      if (!svc.url)
          svc.url = url;

      this.webService.getAuthData(url, this.credentials).subscribe(data => {       
          switch (typeof data) {
              case "string":
                  svc.display = data;
                  break;
              case "object":
                  if (data.size) {
                      var reader = new FileReader();
                      reader.addEventListener('loadend', (result) => {
                          svc.icon = this.sanitizer.bypassSecurityTrustUrl(reader.result);
                      });
                      reader.readAsDataURL(data);
                  }
                  else {
                      svc.display = data.status ? data.status : data.result;
                  }
                  break;
          }          
          
          svc.class = 'panel-primary';
      }, err => {
          svc.class = 'panel-danger';
          this.authRequired = true;
      });
  }
 

  getService(svc) {       
      var url = 'http://smart-app.live/' + svc.path + '/';
      if (!svc.url)
          svc.url = url; 

      this.webService.getData(url).subscribe(data => {
          svc.class = 'panel-primary';
          if (data.acPower != null)
              svc.display = data.acPower ? 'On' : 'Off';
          if (data.temperature) {
              svc.display = data.temperature + '°F';
          }

      },err=> svc.class = 'panel-danger');
  }   

  getCookie(name: string) {
      let ca: Array<string> = document.cookie.split(';');
      let caLen: number = ca.length;
      let cookieName = `${name}=`;
      let c: string;

      for (let i: number = 0; i < caLen; i += 1) {
          c = ca[i].replace(/^\s+/g, '');
          if (c.indexOf(cookieName) == 0) {
              return c.substring(cookieName.length, c.length);
          }
      }
      return '';
  } 

  login() {
      if (this.credentials.user && this.credentials.user.length && this.credentials.pswd && this.credentials.pswd.length) {
          this.credentials.user = this.credentials.user.toLowerCase();
          this.authRequired = false;
          this.setCookie('auth',
              JSON.stringify(this.credentials)
              , 360, '/');

          this.getStatuses();
      }
  }

  setCookie(name: string, value: string, expireDays: number, path: string = '') {
      let d: Date = new Date();
      d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
      let expires: string = `expires=${d.toUTCString()}`;
      let cpath: string = path ? `; path=${path}` : '';
      document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

}
