import { Injectable } from "@angular/core";
import { DataService } from "../data-service/data.service";
import { FunctionsService } from "../functions-service/functions.service";
import { EndPointsEnum } from "src/core/enums/end_points";
import { LogUser } from "src/core/types/log-user";
import { RegisterUser } from "src/core/types/register-user";
import { from, Observable, take } from "rxjs";
import { UserRes } from "src/core/types/user-res";
import { profileRes } from "src/core/types/profile-res";
import { CountryData } from "country-codes-list";
import countriesData from "country-codes-list/dist/countriesData.js"

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

import * as libphonenumber from "google-libphonenumber";


@Injectable({ providedIn: 'root' })

export class AuthService {

  phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

  countries: CountryData[] = countriesData
  country: CountryData = countriesData.find(c => { return c.countryNameEn.toLowerCase() == 'egypt' })

  constructor(
    private dataService: DataService,
    private functionsService: FunctionsService,
  ) { }


  logIn(body: LogUser): Observable<UserRes> {
    return this.dataService.postData(EndPointsEnum.LOGIN, body)
  }


  register(body: RegisterUser): Observable<UserRes> {
    return this.dataService.postData(EndPointsEnum.REGISTER, body)
  }

  profile(id: string): Observable<profileRes> {
    return this.dataService.getOne(EndPointsEnum.PROFILE, id)
  }

  refreshToken(): Observable<any> {
    const refreshPromise = new Promise(async (resolve, reject) => {
      const token = await this.getRefreshToken()
      return this.dataService.getData(EndPointsEnum.REFRESH_TOKEN + token)
        .subscribe({
          next: (res) => {
            resolve(res.token)
            this.storeAccessToken(res.access_token);
          }, error: e => reject(e)
        })
    })

    return from(refreshPromise)
  }


  async logOut(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const token = await this.getRefreshToken()
      return this.dataService.postData(EndPointsEnum.LOGOUT, { token: token })
        .subscribe((res: { success: true }) => {
          // this.functionsService
          resolve(res.success)
        }, err => reject(err))
    })
  }


  storeRefreshToken(token: string) {
    return this.dataService.storeRefreshToken(token)
  }

  getRefreshToken() {
    return this.dataService.getRefreshToken()
  }

  storeAccessToken(token: string) {
    return this.dataService.storeAccessToken(token)
  }

  getAccessToken() {
    return this.dataService.getAccessToken()
  }


































  validatePhoneNumber(regionCode: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneNumber = control.value;
      if (!phoneNumber) {
        return { required: true };
      }
      try {
        const parsedNumber = this.phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode);
        if (this.phoneUtil.isValidNumber(parsedNumber)) {
          return null; // Valid phone number
        }
      } catch (error) {
        return { invalidPhoneNumber: true }; // Invalid phone number
      }

      return { invalidPhoneNumber: true };
    };
  }




}
