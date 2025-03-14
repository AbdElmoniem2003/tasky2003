import { Component, OnInit } from '@angular/core';
import { CountryData } from 'country-codes-list';
import { AuthService } from 'src/core/Services/auth-service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'], standalone: false

})
export class LoginPage implements OnInit {

  displayPassword: boolean = false
  country: CountryData


  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.country = this.authService.country
  }

}
