import { Component, OnInit } from '@angular/core';
import { CountryData } from 'country-codes-list';
import { AuthService } from 'src/core/Services/auth-service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'], standalone: false

})
export class RegisterPage implements OnInit {

  country: CountryData
  displayPassword: boolean = false

  
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.country = this.authService.country
  }

}
