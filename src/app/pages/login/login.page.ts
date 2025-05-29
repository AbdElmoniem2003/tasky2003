import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryData } from 'country-codes-list';
import { AuthService } from 'src/core/Services/auth-service/auth.service';

import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { EndPointsEnum } from 'src/core/enums/end_points';
import { DataService } from 'src/core/Services/data-service/data.service';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { CountryComponent } from '../country/country.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'], standalone: false

})
export class LoginPage implements OnInit {

  displayPassword: boolean = false
  country: CountryData = this.authService.country;
  loginForm: FormGroup


  constructor(
    private authService: AuthService,
    private funcService: FunctionsService,
    private dataService: DataService,
    private form: FormBuilder,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.initLoginForm()
  }


  initLoginForm() {
    this.loginForm = this.form.group({
      phone: [null, [Validators.required, this.authService.validatePhoneNumber(this.country.countryCode)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  login() {
    if (this.loginForm.invalid) return;
    this.authService.logIn(this.loginForm.value).subscribe((res) => {
      this.authService.storeRefreshToken(res.refresh_token)
      localStorage.setItem(EndPointsEnum.ACCESS, res.access_token)
      this.navCtrl.navigateForward('/tasks')
    }, err => {
      this.funcService.generalToast({ message: err.error.message, color: 'danger' })
    })
  }

  async pickCountry(ev: any) {
    const modal = await this.modalCtrl.create({
      
      mode: 'ios',
      component: CountryComponent,
    })
    modal.initialBreakpoint = 0.5
    modal.breakpoints = [0, 0.25, 0.5, 0.75]
    await modal.present()

    this.country = (await modal.onWillDismiss()).data || this.country
    // validate of previos and current country
    // this.loginForm.get('phone').setValue(null)
    // this.country.countryCode = (await modal.onWillDismiss()).data.countryCode
    this.initLoginForm()

  }


  toRegister() {
    this.navCtrl.navigateForward('/register')
  }



}
