import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CountryData } from 'country-codes-list';
import { AuthService } from 'src/core/Services/auth-service/auth.service';
import { CountryComponent } from '../country/country.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      "phone": ['', [Validators.required, (control: AbstractControl) => {
        return this.authService.validatePhoneNumber(control.value, this.country.countryCode);
      }]],
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
        this.authService.register(this.registerForm.value).subscribe((res) => {
          this.authService.storeRefreshToken(res.refresh_token)
          localStorage.setItem(EndPointsEnum.ACCESS, res.access_token)
          this.navCtrl.navigateForward('/tasks')
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
    this.authService.checkAfterPickCountry(this.registerForm, this.country)
  }



  toLogin() {
    this.navCtrl.navigateBack('/login')
  }

}
