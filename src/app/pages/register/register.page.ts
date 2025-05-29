import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CountryData } from 'country-codes-list';
import { AuthService } from 'src/core/Services/auth-service/auth.service';
import { CountryComponent } from '../country/country.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { EndPointsEnum } from 'src/core/enums/end_points';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'], standalone: false

})
export class RegisterPage implements OnInit {

  country: CountryData
  displayPassword: boolean = false
  registerForm: FormGroup


  constructor(
    private authService: AuthService,
    private funcService: FunctionsService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private builder: FormBuilder

  ) { }

  ngOnInit() {
    this.country = this.authService.country
    this.initForm();
  };


  initForm() {
    this.registerForm = this.builder.group({
      "phone": ['', [Validators.required, this.authService.validatePhoneNumber(this.country.countryCode)]],
      "password": ['', [Validators.required, Validators.minLength(6)]],
      "displayName": ['', [Validators.required,]],
      "experienceYears": ['', [Validators.required,]],
      "address": ['', [Validators.required,]],
      "level": ['', [Validators.required,]]
    })
  }


  register() {
    this.authService.register(this.registerForm.value)
      .subscribe(() => {
        if (this.registerForm.invalid) return;
        this.authService.logIn(this.registerForm.value).subscribe((res) => {
          this.authService.storeRefreshToken(res.refresh_token)
          localStorage.setItem(EndPointsEnum.ACCESS, res.access_token)
          this.navCtrl.navigateForward('/tasks')
        }, err => {
          this.funcService.generalToast({ message: err.error.message, color: 'danger' })
        })
      })
  }























  async pickCountry() {
    const modal = await this.modalCtrl.create({
      component: CountryComponent,
    })
    modal.initialBreakpoint = 0.5
    modal.breakpoints = [0, 0.25, 0.5, 0.75]
    await modal.present()

    this.country = (await modal.onWillDismiss()).data || this.country
    // validate of previos and current country
    // this.registerForm.get('phone').setValue(null)
    // this.country.countryCode = (await modal.onWillDismiss()).data.countryCode
    this.initForm()
  }

  toLogin() {
    this.navCtrl.navigateBack('/login')
  }

}
