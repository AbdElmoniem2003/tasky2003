import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CountryData } from 'country-codes-list';
import countriesData from "country-codes-list/dist/countriesData.js";
import { AuthService } from 'src/core/Services/auth-service/auth.service';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  imports: [FormsModule]
})
export class CountryComponent implements OnInit {

  countries: CountryData[] = countriesData;
  clonnedCountriesList = this.countries
  countryFilter: string;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

  filter() {
    this.countries = this.clonnedCountriesList;
    const byCallingCode = "+" + this.countryFilter.trim()
    const byName = this.countryFilter.trim().toLowerCase()
    const byCurrency = this.countryFilter.trim().toLowerCase()
    this.countries = this.countries.filter((country) => {
      return (
        country.countryCallingCode.includes(byCallingCode)
        || country.countryNameLocal.toLowerCase().includes(byName)
        || country.countryNameEn.toLowerCase().includes(byName)
        || country.currencyCode.toLowerCase().includes(byCurrency)
      )
    })
  }

  dismissCountry(country: CountryData) {
    // console.log(this.authService.country)
    // this.authService.country = country
    // console.log(this.authService.country)
    this.modalCtrl.dismiss(country)
  }

}
