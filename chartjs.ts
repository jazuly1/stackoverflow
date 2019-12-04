import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { RestApiService } from '../../services/rest-api.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
	
	QRdata = {'qrcodestring':'',person:''};
	dataProduct:any
	CekLogin = JSON.parse(localStorage.getItem('userData'));

	constructor(private barcodeScanner: BarcodeScanner,public api: RestApiService, public alertController: AlertController,
		private router: Router, private loadingController: LoadingController, private toastController: ToastController,
		public navCtrl: NavController) { }

	ngOnInit() {
		console.log(JSON.parse(localStorage.getItem('tempdatasurvey')))
	}

	async presentAlert(response) {
	    const alert = await this.alertController.create({
	      	header: 'Success',
	      	subHeader: '',
	      	message: JSON.stringify(response),
	      	buttons: [
		      {
		        text: 'Cancel',
		        role: 'cancel',
		        handler: () => {
		          console.log('Cancel clicked');
		        }
		      },
		      {
		        text: 'Ok',
		        handler: () => {
		          this.router.navigate(['/success-scan-qr']);
		        }
		      }
		    ]
	    });

	    await alert.present();
	}

	async presentToast(text) {
	    const toast = await this.toastController.create({
	        message: text,
	        position: 'bottom',
	        duration: 3000
	    });
	    toast.present();
	}

	async warningAlert() {
	    const alert = await this.alertController.create({
	      	header: 'Warning!',
	      	subHeader: '',
	      	message: 'Data not valid, try to scan again.',
	      	buttons: ['OK']
	    });

	    await alert.present();
	}

	scanQRCode(){
		this.barcodeScanner.scan().then(barcodeData => {
		 	this.QRdata.qrcodestring = barcodeData.text
		 	if (!this.QRdata.qrcodestring) {
				this.warningAlert()
			} else {
				this.inputlogscan();
			}
		}).catch(err => {
		    console.log('Error', err);
		    this.warningAlert()
		});
	}

	async inputlogscan(){
		const loading = await this.loadingController.create({
	        message: 'Loading...',
	    });
	    await loading.present();

		this.QRdata.person = this.CekLogin.data.id;

		this.api.post(this.QRdata, 'product/store-scan-qrcode')
		.then( (result:any) => {
			var response = result
			if(response['errors'] == 1){
				this.warningAlert()
			}else{

				if (response.data.classification === 1) {

					this.dataProduct = response.data
					this.dataProduct.PersonID = this.CekLogin.data.id
					loading.dismiss();
					this.inputTimeKeepingLog()

				} else if (response.data.classification === 8 && this.CekLogin.data.role === 'quality') {

					loading.dismiss();
					let navigationExtras: NavigationExtras = {
				        queryParams: {
				          productID: response.data.id,
				          category: response.data.category,
				        }
				    };
					this.navCtrl.navigateForward(['/quality'], navigationExtras)

				} else {

					loading.dismiss();
					let id = response.data.ProductID
					this.router.navigate(['/success-scan-qr/'+id])

				}
			}

			this.QRdata.qrcodestring = "";

		})
	}

	async inputTimeKeepingLog(){
		const loading = await this.loadingController.create({
	        message: 'Loading...',
	    });
	    
		this.api.post(this.dataProduct, 'product/timekeeping/store')
			.then( (result:any) => {
				var response = result
				if(response['errors'] == 1){
					this.warningAlert()
				} else {
					loading.dismiss();
					this.presentToast(response['msg']);
					this.router.navigate(['/timekeeping'])
				}

			})
	}

	underdevelopment(){
		alert('Under Development!')
	}
}
