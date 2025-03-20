import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/core/Services/data-service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private navCtrl: NavController,
    private dataService: DataService
  ) { }

  async ngOnInit() {
    const refresh_token = await this.dataService.getRefreshToken();
    const isWeb = Capacitor.getPlatform() == 'web'
    if (refresh_token) {
      this.navCtrl.navigateForward('/tasks');
    } else {
      this.navCtrl.navigateForward(isWeb ? '/login' : '/start')
    }
  }
}
