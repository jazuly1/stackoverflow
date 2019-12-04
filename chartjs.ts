import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { RestApiService } from '../../../services/rest-api.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild('barChart') barChart;

  bars:any;
  colorArray:any;
  CekLogin = JSON.parse(localStorage.getItem('userData'));
  dataSurveys:any

  constructor(public api: RestApiService, private router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.dataSurvey()
  }

  ionViewDidLeave() {

  }

  dataSurvey() {
  	this.api.get('product/getsurvey/'+this.CekLogin.data.id)
	    .subscribe((result:any) => {

    		this.dataSurveys = result.data

    		localStorage.setItem('tempdatasurvey', JSON.stringify(this.dataSurveys.detailProd));

    		if (this.dataSurveys) {
    			this.createBarChart()
    		}

	    })
    }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'pie',
      data: {
        labels: this.dataSurveys.prodName,
        datasets: [{
          data: this.dataSurveys.prodScore,
          backgroundColor: this.dataSurveys.prodColor,
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }]
      },
      options: {
      	onClick: this.handle,
        title: {
            display: false,
            text: this.dataSurveys,
        },
      },
    });
  }

  handle(pointer, event) {
    const blabla = require('../../../../../node_modules/@angular/router');
    console.log(blabla)
    blabla.Router.navigate(['/timekeeping'])
    console.log(event[0]._index, this)
  }

}
