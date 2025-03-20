import { Component, OnInit } from '@angular/core';
import { CountryData } from 'country-codes-list';
import { EndPointsEnum } from 'src/core/enums/end_points';
import { AuthService } from 'src/core/Services/auth-service/auth.service';
import { DataService } from 'src/core/Services/data-service/data.service';
import { profileRes } from 'src/core/types/profile-res';
import { Clipboard } from "@capacitor/clipboard"
import { FunctionsService } from 'src/core/Services/functions-service/functions.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'], standalone: false

})
export class ProfilePage implements OnInit {

  profile: profileRes;
  profileCountry: CountryData = this.authService.country

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private funcService: FunctionsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadProfile()
  }

  async loadProfile() {
    const logged = await this.dataService.getUser()
    if (logged) { this.profile = logged; }
    else {
      this.dataService.getData(EndPointsEnum.PROFILE).subscribe((res: profileRes) => {
        this.dataService.storeUser(res)
        this.profile = res
      })
    }
  }

  copyPhone(phone: string) {

    Clipboard.write({ string: phone });
    this.funcService.generalToast({
      message: phone + " Copied Successfully",
      color: 'success'
    })
  }

  back() {
    this.navCtrl.navigateBack('/tasks')
  }

  formatPhone() {
    const callingCode = this.profileCountry.countryCallingCode
  }
}
