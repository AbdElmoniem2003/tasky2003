import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CountryData } from 'country-codes-list';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {

  countries: CountryData[]

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

  }

}
