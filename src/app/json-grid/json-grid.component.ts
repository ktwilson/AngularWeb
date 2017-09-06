import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../services/utility';

@Component({
  selector: 'app-json-grid',
  templateUrl: './json-grid.component.html',
  styleUrls: ['./json-grid.component.css'],
  providers: [UtilityService]
})
export class JsonGridComponent implements OnInit {

    title = 'JsonGrid';
    wsUrl: string;
    dataset: Array<object>;
    headers: Array<string>;

    constructor(private webService: UtilityService) {
        this.wsUrl = '';
        this.dataset = [];
        this.headers = []
    }

    ngOnInit() {
    }

    loadData() {
        if (this.wsUrl == '')
            return;

        this.dataset = [];
        this.headers = [];


        this.webService.getData(this.wsUrl).subscribe(data => {
            
            this.dataset = data.length ? data : [data];

            var row = this.dataset[0];
            Object.keys(row).forEach(hdr => {
                this.headers.push(hdr);
            });

            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                for (var j = 0; j < this.headers.length; j++) {
                    var d = r[this.headers[j]];
                    if (typeof d === 'object') {
                        r[this.headers[j]] = JSON.stringify(d);
                    }
                }
            }
          
            
        })

    }

}
