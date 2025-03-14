import { Injectable } from "@angular/core";
import { DataService } from "../data-service/data.service";
import { FunctionsService } from "../functions-service/functions.service";


import { EndPointsEnum } from "src/core/enums/end_points";
import { LogUser } from "src/core/types/log-user";
import { RegisterUser } from "src/core/types/register-user";
import { Observable } from "rxjs";
import { UserRes } from "src/core/types/user-res";
import { profileRes } from "src/core/types/profile-res";
import { ModalController } from "@ionic/angular";
import { CountryData } from "country-codes-list";
import countriesData from "country-codes-list/dist/countriesData.js"
import { CountryComponent } from "src/app/pages/country/country.component";


@Injectable({ providedIn: 'root' })

export class AuthService {

  countries: CountryData[] = countriesData
  country: CountryData = countriesData.find(c => { return c.countryNameEn.toLowerCase() == 'egypt' })

  constructor(
    private dataService: DataService,
    private functionsService: FunctionsService,
    private modalCtrl: ModalController
  ) { }


  logIn(body: LogUser) {
    this.dataService.postData(EndPointsEnum.LOGIN, body)
  }


  register(body: RegisterUser): Observable<UserRes> {
    return this.dataService.postData(EndPointsEnum.REGISTER, body)
  }

  getProfile(id: string): Observable<profileRes> {
    return this.dataService.getOne(EndPointsEnum.PROFILE, id)
  }

  async viewCountriesModal() {
    const modal = await this.modalCtrl.create({
      component: CountryComponent,
      componentProps: {
        countries: this.countries
      }
    })
    await modal.present()
    await modal.dismiss(this.country)
  }



}
